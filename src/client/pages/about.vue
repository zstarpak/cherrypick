<template>
<FormBase>
	<div class="_formItem">
		<div class="_formPanel fwhjspax">
			<img :src="$instance.iconUrl || $instance.faviconUrl || '/favicon.ico'" alt="" class="icon"/>
			<span class="name">{{ $instance.name || host }}</span>
		</div>
	</div>

	<FormTextarea readonly :value="$instance.description">
	</FormTextarea>

	<FormGroup>
		<FormKeyValueView>
			<template #key>CherryPick</template>
			<template #value>v{{ version }}</template>
		</FormKeyValueView>
		<FormLink to="/about-misskey">{{ $ts.aboutMisskey }}</FormLink>
	</FormGroup>

	<FormGroup v-if="isKokonect">
		<FormLink to="https://www.patreon.com/noridev" external>
			<template #icon><i class="fas fa-hand-holding-medical"></i></template>
			{{ $ts._aboutMisskey._kokonect.donate }}
			<template #suffix>Patreon</template>
		</FormLink>
	</FormGroup>

	<FormGroup>
		<FormKeyValueView>
			<template #key>{{ $ts.administrator }}</template>
			<template #value>{{ $instance.maintainerName }}</template>
		</FormKeyValueView>
		<FormKeyValueView>
			<template #key>{{ $ts.contact }}</template>
			<template #value>{{ $instance.maintainerEmail }}</template>
		</FormKeyValueView>
	</FormGroup>

	<FormLink v-if="$instance.tosUrl" :to="$instance.tosUrl" external>{{ $ts.tos }}</FormLink>

	<FormSuspense :p="initStats">
		<FormGroup>
			<template #label>{{ $ts.statistics }}</template>
			<FormKeyValueView>
				<template #key>{{ $ts.users }}</template>
				<template #value>{{ number(stats.originalUsersCount) }}</template>
			</FormKeyValueView>
			<FormKeyValueView>
				<template #key>{{ $ts.notes }}</template>
				<template #value>{{ number(stats.originalNotesCount) }}</template>
			</FormKeyValueView>
		</FormGroup>
	</FormSuspense>

	<FormGroup>
		<template #label>Well-known resources</template>
		<FormLink :to="`/.well-known/host-meta`" external>host-meta</FormLink>
		<FormLink :to="`/.well-known/host-meta.json`" external>host-meta.json</FormLink>
		<FormLink :to="`/.well-known/nodeinfo`" external>nodeinfo</FormLink>
		<FormLink :to="`/robots.txt`" external>robots.txt</FormLink>
		<FormLink :to="`/manifest.json`" external>manifest.json</FormLink>
	</FormGroup>
</FormBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { version, instanceName } from '@client/config';
import FormLink from '@client/components/form/link.vue';
import FormBase from '@client/components/form/base.vue';
import FormGroup from '@client/components/form/group.vue';
import FormKeyValueView from '@client/components/form/key-value-view.vue';
import FormTextarea from '@client/components/form/textarea.vue';
import FormSuspense from '@client/components/form/suspense.vue';
import * as os from '@client/os';
import number from '@client/filters/number';
import * as symbols from '@client/symbols';
import { host } from '@client/config';
import VanillaTilt from "vanilla-tilt";

export default defineComponent({
	components: {
		FormBase,
		FormGroup,
		FormLink,
		FormKeyValueView,
		FormTextarea,
		FormSuspense,
	},

	data() {
		return {
			[symbols.PAGE_INFO]: {
				title: this.$ts.instanceInfo,
				icon: 'fas fa-info-circle'
			},
			host,
			version,
			instanceName,
			stats: null,
			initStats: () => os.api('stats', {
			}).then((stats) => {
				this.stats = stats;
			}),
			isKokonect: null
		}
	},

	mounted() {
		this.init();
	},

	methods: {
		number,

		async init() {
			const meta = await os.api('meta', { detail: true });
			this.isKokonect = meta.uri == 'https://kokonect.link' || 'http://localhost:3000';
		}
	}
});
</script>

<style lang="scss" scoped>
.fwhjspax {
	padding: 16px;
	text-align: center;

	> .icon {
		display: block;
		margin: auto;
		height: 64px;
		border-radius: 8px;
	}

	> .name {
		display: block;
		margin-top: 12px;
	}
}
</style>
