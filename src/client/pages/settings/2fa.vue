<template>
<section class="_card">
	<div class="_title"><i class="fas fa-lock"></i> {{ $ts.twoStepAuthentication }}</div>
	<div class="_content">
		<MkButton v-if="!data && !$i.twoFactorEnabled" @click="register">{{ $ts._2fa.registerDevice }}</MkButton>
		<template v-if="$i.twoFactorEnabled">
			<p>{{ $ts._2fa.alreadyRegistered }}</p>
			<MkButton @click="unregister">{{ $ts.unregister }}</MkButton>

			<template v-if="supportsCredentials">
				<hr class="totp-method-sep">

				<h2 class="heading">{{ $ts.securityKey }}</h2>
				<p>{{ $ts._2fa.securityKeyInfo }}</p>
				<div class="key-list">
					<div class="key" v-for="key in $i.securityKeysList">
						<h3>{{ key.name }}</h3>
						<div class="last-used">{{ $ts.lastUsed }}<MkTime :time="key.lastUsed"/></div>
						<MkButton @click="unregisterKey(key)">{{ $ts.unregister }}</MkButton>
					</div>
				</div>

				<MkSwitch v-model="usePasswordLessLogin" @update:modelValue="updatePasswordLessLogin" v-if="$i.securityKeysList.length > 0">{{ $ts.passwordLessLogin }}</MkSwitch>

				<MkInfo warn v-if="registration && registration.error">{{ $ts.error }} {{ registration.error }}</MkInfo>
				<MkButton v-if="!registration || registration.error" @click="addSecurityKey">{{ $ts._2fa.registerKey }}</MkButton>

				<ol v-if="registration && !registration.error">
					<li v-if="registration.stage >= 0">
						{{ $ts.tapSecurityKey }}
						<i v-if="registration.saving && registration.stage == 0" class="fas fa-spinner fa-pulse fa-fw"></i>
					</li>
					<li v-if="registration.stage >= 1">
						<MkForm :disabled="registration.stage != 1 || registration.saving">
							<MkInput v-model="keyName" :max="30">
								<template #label>{{ $ts.securityKeyName }}</template>
							</MkInput>
							<MkButton @click="registerKey" :disabled="keyName.length == 0">{{ $ts.registerSecurityKey }}</MkButton>
							<i v-if="registration.saving && registration.stage == 1" class="fas fa-spinner fa-pulse fa-fw"></i>
						</MkForm>
					</li>
				</ol>
			</template>
		</template>
		<div v-if="data && !$i.twoFactorEnabled">
			<ol style="margin: 0; padding: 0 0 0 1em;">
				<li>
					<I18n :src="$ts._2fa.step1" tag="span">
						<template #a>
							<a href="https://authy.com/" rel="noopener" target="_blank" class="_link">Authy</a>
						</template>
						<template #b>
							<a href="https://support.google.com/accounts/answer/1066447" rel="noopener" target="_blank" class="_link">Google Authenticator</a>
						</template>
					</I18n>
				</li>
				<li>{{ $ts._2fa.step2 }}<br><img :src="data.qr"></li>
				<li>{{ $ts._2fa.step3 }}<br>
					<MkInput v-model="token" type="text" pattern="^[0-9]{6}$" autocomplete="off" spellcheck="false"><template #label>{{ $ts.token }}</template></MkInput>
					<MkButton primary @click="submit">{{ $ts.done }}</MkButton>
				</li>
			</ol>
			<MkInfo>{{ $ts._2fa.step4 }}</MkInfo>
		</div>
	</div>
</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { hostname } from '@client/config';
import { byteify, hexify, stringify } from '@client/scripts/2fa';
import MkButton from '@client/components/ui/button.vue';
import MkInfo from '@client/components/ui/info.vue';
import MkInput from '@client/components/ui/input.vue';
import MkSwitch from '@client/components/ui/switch.vue';
import FormBase from '@client/components/form/base.vue';
import FormGroup from '@client/components/form/group.vue';
import FormButton from '@client/components/form/button.vue';
import * as os from '@client/os';
import * as symbols from '@client/symbols';

export default defineComponent({
	components: {
		FormBase,
		MkButton, MkInfo, MkInput, MkSwitch
	},

	emits: ['info'],

	data() {
		return {
			[symbols.PAGE_INFO]: {
				title: this.$ts.twoStepAuthentication,
				icon: 'fas fa-lock'
			},
			data: null,
			supportsCredentials: !!navigator.credentials,
			usePasswordLessLogin: this.$i.usePasswordLessLogin,
			registration: null,
			keyName: '',
			token: null,
		};
	},

	methods: {
		register() {
			os.dialog({
				title: this.$ts.password,
				input: {
					type: 'password'
				}
			}).then(({ canceled, result: password }) => {
				if (canceled) return;
				os.api('i/2fa/register', {
					password: password
				}).then(data => {
					this.data = data;
				});
			});
		},

		unregister() {
			os.dialog({
				title: this.$ts.password,
				input: {
					type: 'password'
				}
			}).then(({ canceled, result: password }) => {
				if (canceled) return;
				os.api('i/2fa/unregister', {
					password: password
				}).then(() => {
					this.usePasswordLessLogin = false;
					this.updatePasswordLessLogin();
				}).then(() => {
					os.success();
					this.$i.twoFactorEnabled = false;
				});
			});
		},

		submit() {
			os.api('i/2fa/done', {
				token: this.token
			}).then(() => {
				os.success();
				this.$i.twoFactorEnabled = true;
			}).catch(e => {
				os.dialog({
					type: 'error',
					text: e
				});
			});
		},

		registerKey() {
			this.registration.saving = true;
			os.api('i/2fa/key-done', {
				password: this.registration.password,
				name: this.keyName,
				challengeId: this.registration.challengeId,
				// we convert each 16 bits to a string to serialise
				clientDataJSON: stringify(this.registration.credential.response.clientDataJSON),
				attestationObject: hexify(this.registration.credential.response.attestationObject)
			}).then(key => {
				this.registration = null;
				key.lastUsed = new Date();
				os.success();
			})
		},

		unregisterKey(key) {
			os.dialog({
				title: this.$ts.password,
				input: {
					type: 'password'
				}
			}).then(({ canceled, result: password }) => {
				if (canceled) return;
				return os.api('i/2fa/remove-key', {
					password,
					credentialId: key.id
				}).then(() => {
					this.usePasswordLessLogin = false;
					this.updatePasswordLessLogin();
				}).then(() => {
					os.success();
				});
			});
		},

		addSecurityKey() {
			os.dialog({
				title: this.$ts.password,
				input: {
					type: 'password'
				}
			}).then(({ canceled, result: password }) => {
				if (canceled) return;
				os.api('i/2fa/register-key', {
					password
				}).then(registration => {
					this.registration = {
						password,
						challengeId: registration.challengeId,
						stage: 0,
						publicKeyOptions: {
							challenge: byteify(registration.challenge, 'base64'),
							rp: {
								id: hostname,
								name: 'CherryPick'
							},
							user: {
								id: byteify(this.$i.id, 'ascii'),
								name: this.$i.username,
								displayName: this.$i.name,
							},
							pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
							timeout: 60000,
							attestation: 'direct'
						},
						saving: true
					};
					return navigator.credentials.create({
						publicKey: this.registration.publicKeyOptions
					});
				}).then(credential => {
					this.registration.credential = credential;
					this.registration.saving = false;
					this.registration.stage = 1;
				}).catch(err => {
					console.warn('Error while registering?', err);
					this.registration.error = err.message;
					this.registration.stage = -1;
				});
			});
		},

		updatePasswordLessLogin() {
			os.api('i/2fa/password-less', {
				value: !!this.usePasswordLessLogin
			});
		}
	}
});
</script>
