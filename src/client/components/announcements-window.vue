<template>
<XModalWindow ref="window"
	:width="400"
	:height="450"
	:with-ok-button="false"
	:canClose="true"
	@close="$refs.window.close()"
	@closed="$emit('closed')"
>
	<template #header>{{ $ts.announcements }}</template>
	<div class="vnue729s">
		<div class="title">{{ currentAnnouncement.title }}</div>
		<div class="content">
			<Mfm :text="currentAnnouncement.text" :once="false"/>
			<img v-if="currentAnnouncement.imageUrl" :src="currentAnnouncement.imageUrl"/>
		</div>
	</div>
	<template #footer>
		<div class="navigation">
			<button class="_button arrow" @click="currentAnnouncementIndex--" :disabled="currentAnnouncementIndex == 0">
				<i class="fas fa-chevron-left"/>
			</button>
			<span>{{ currentAnnouncementIndex + 1 }} / {{ announcements.length }}</span>
			<button class="_button arrow" @click="currentAnnouncementIndex++" :disabled="currentAnnouncementIndex == announcements.length - 1">
				<i class="fas fa-chevron-right"/>
			</button>
		</div>
	</template>
</XModalWindow>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import XModalWindow from './ui/modal-window-announcements.vue';
import MkButton from './ui/button.vue';
import Mfm from "./mfm";

export default defineComponent({
	components: {
		Mfm,
		XModalWindow,
		MkButton,
	},

	props: {
		announcements: {
			type: Array as PropType<string[]>,
			required: false,
			default: null
		},
	},

	emits: ['closed'],

	data() {
		return {
			currentAnnouncementIndex: 0,
		};
	},

	computed: {
		currentAnnouncement() {
			if (this.announcements.length > 0) {
				if (this.currentAnnouncementIndex < 0)
					this.currentAnnouncementIndex = 0;
				if (this.currentAnnouncementIndex >= this.announcements.length)
					this.currentAnnouncementIndex = this.announcements.length - 1;

				return this.announcements[this.currentAnnouncementIndex];
			}
			return null;
		},
	},

	watch: {
		currentAnnouncementIndex() {
			this.$emit('read', this.currentAnnouncement);
		}
	},

	mounted() {
		this.$nextTick(() =>
			this.$emit('read', this.currentAnnouncement)
		);
	},

	methods: {}
});
</script>

<style lang="scss" scoped>
.vnue729s {
	padding: 24px;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	height: 100%;

	> .title {
		font-weight: bold;
		margin-bottom: 1em;
		font-size: 1.5em;
	}

	> .content {
		overflow: auto;

		> img {
			margin-top: 16px;
			display: block;
			border-radius: var(--radius);
		}
	}
}

.navigation {
	> button.arrow {
		width: 58px;
		margin: 0;
	}

	> span {
		margin: 0 8px;
	}
}
</style>
