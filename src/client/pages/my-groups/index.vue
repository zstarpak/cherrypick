<template>
<div class="">
	<div class="_section" style="padding: 0;">
		<MkTab v-model:value="tab" :class="{ 'friendly': isFriendlyUI || isFriendlyUILegacy }">
			<option value="owned">{{ $ts.ownedGroups }}</option>
			<option value="joined">{{ $ts.joinedGroups }}</option>
			<option value="invites"><i class="fas fa-envelope-open-text"></i> {{ $ts.invites }}</option>
		</MkTab>
	</div>

	<div class="_section">
		<div class="_content" v-if="tab === 'owned'">
			<MkButton v-if="(isWideTablet || isDesktop) && (isFriendlyUI || isFriendlyUILegacy) || !(isFriendlyUI || isFriendlyUILegacy)" @click="create" primary style="margin: 0 auto var(--margin) auto;"><i class="fas fa-plus"></i> {{ $ts.createGroup }}</MkButton>

			<MkPagination :pagination="ownedPagination" #default="{items}" ref="owned">
				<div class="_card" v-for="group in items" :key="group.id">
					<div class="_title"><MkA :to="`/my/groups/${ group.id }`" class="_link">{{ group.name }}</MkA></div>
					<div class="_content"><MkAvatars :user-ids="group.userIds"/></div>
				</div>
			</MkPagination>
		</div>

		<div class="_content" v-else-if="tab === 'joined'">
			<MkPagination :pagination="joinedPagination" #default="{items}" ref="joined">
				<div class="_card" v-for="group in items" :key="group.id">
					<div class="_title">{{ group.name }}</div>
					<div class="_content"><MkAvatars :user-ids="group.userIds"/></div>
				</div>
			</MkPagination>
		</div>
	
		<div class="_content" v-else-if="tab === 'invites'">
			<MkPagination :pagination="invitationPagination" #default="{items}" ref="invitations">
				<div class="_card" v-for="invitation in items" :key="invitation.id">
					<div class="_title">{{ invitation.group.name }}</div>
					<div class="_content"><MkAvatars :user-ids="invitation.group.userIds"/></div>
					<div class="_footer">
						<MkButton @click="acceptInvite(invitation)" primary inline><i class="fas fa-check"></i> {{ $ts.accept }}</MkButton>
						<MkButton @click="rejectInvite(invitation)" primary inline><i class="fas fa-ban"></i> {{ $ts.reject }}</MkButton>
					</div>
				</div>
			</MkPagination>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MkPagination from '@client/components/ui/pagination.vue';
import MkButton from '@client/components/ui/button.vue';
import MkContainer from '@client/components/ui/container.vue';
import MkAvatars from '@client/components/avatars.vue';
import MkTab from '@client/components/tab.vue';
import * as os from '@client/os';
import * as symbols from '@client/symbols';

const DESKTOP_THRESHOLD = 1100;
const WIDE_TABLET_THRESHOLD = 850;

export default defineComponent({
	components: {
		MkPagination,
		MkButton,
		MkContainer,
		MkTab,
		MkAvatars,
	},

	data() {
		return {
			[symbols.PAGE_INFO]: {
				title: this.$ts.groups,
				icon: 'fas fa-users',
				action: {
					icon: 'fas fa-plus',
					handler: this.create
				}
			},
			tab: 'owned',
			ownedPagination: {
				endpoint: 'users/groups/owned',
				limit: 10,
			},
			joinedPagination: {
				endpoint: 'users/groups/joined',
				limit: 10,
			},
			invitationPagination: {
				endpoint: 'i/user-group-invites',
				limit: 10,
			},
			isWideTablet: window.innerWidth >= WIDE_TABLET_THRESHOLD,
			isDesktop: window.innerWidth >= DESKTOP_THRESHOLD,
			isFriendlyUI: localStorage.getItem('ui') == "friendly",
			isFriendlyUILegacy: localStorage.getItem('ui') == "friendly-legacy",
		};
	},

	methods: {
		async create() {
			const { canceled, result: name } = await os.dialog({
				title: this.$ts.groupName,
				input: true
			});
			if (canceled) return;
			await os.api('users/groups/create', { name: name });
			this.$refs.owned.reload();
			os.success();
		},
		acceptInvite(invitation) {
			os.api('users/groups/invitations/accept', {
				invitationId: invitation.id
			}).then(() => {
				os.success();
				this.$refs.invitations.reload();
				this.$refs.joined.reload();
			});
		},
		rejectInvite(invitation) {
			os.api('users/groups/invitations/reject', {
				invitationId: invitation.id
			}).then(() => {
				this.$refs.invitations.reload();
			});
		}
	}
});
</script>

<style lang="scss" scoped>
.friendly {
	@media (min-width: 601px) {
		margin: -8px -8px auto;
	}
}
</style>
