<template>
<MkModal ref="modal" @click="$emit('click')" @closed="$emit('closed')">
	<div class="ebkgoccj _popup _narrow_" @keydown="onKeydown" :style="{ width: `${width}px`, height: scroll ? (height ? `${height}px` : null) :  (height ? `min(${height}px, 100%)` : '100%') }">
		<div class="header">
			<button class="_button" v-if="withOkButton" @click="$emit('close')"><i class="fas fa-times"></i></button>
			<span class="title">
				<i class="fas fa-bullhorn"/>
				<slot name="header"></slot>
			</span>
			<button class="_button" v-if="!withOkButton" @click="$emit('close')"><i class="fas fa-times"></i></button>
			<button class="_button" v-if="withOkButton" @click="$emit('ok')" :disabled="okButtonDisabled"><i class="fas fa-check"></i></button>
		</div>
		<div class="body" v-if="padding">
			<div class="_section">
				<slot></slot>
			</div>
		</div>
		<div class="body" v-else>
			<slot></slot>
		</div>
		<div class="footer">
			<div class="content">
				<slot name="footer"></slot>
			</div>
		</div>
	</div>
</MkModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MkModal from './modal.vue';

export default defineComponent({
	components: {
		MkModal
	},
	props: {
		withOkButton: {
			type: Boolean,
			required: false,
			default: false
		},
		okButtonDisabled: {
			type: Boolean,
			required: false,
			default: false
		},
		padding: {
			type: Boolean,
			required: false,
			default: false
		},
		width: {
			type: Number,
			required: false,
			default: 400
		},
		height: {
			type: Number,
			required: false,
			default: null
		},
		canClose: {
			type: Boolean,
			required: false,
			default: true,
		},
		scroll: {
			type: Boolean,
			required: false,
			default: true,
		},
	},

	emits: ['click', 'close', 'closed', 'ok'],

	data() {
		return {
		};
	},

	methods: {
		close() {
			this.$refs.modal.close();
		},

		onKeydown(e) {
			if (e.which === 27) { // Esc
				e.preventDefault();
				e.stopPropagation();
				this.close();
			}
		},
	}
});
</script>

<style lang="scss" scoped>
$height: 58px;
$height-narrow: 50px;

@use "sass:math";

.ebkgoccj {
	overflow: hidden;
	display: flex;
	flex-direction: column;
	contain: content;

	--root-margin: 24px;

	@media (max-width: 500px) {
		--root-margin: 16px;
	}

	> .header {
		display: flex;
		flex-shrink: 0;
		box-shadow: 0px 1px var(--divider);

		> button {
			height: $height;
			width: $height;

			@media (max-width: 500px) {
				height: $height-narrow;
				width: $height-narrow;
			}
		}

		> .title {
			flex: 1;
			line-height: $height;
			padding-left: 24px;
			font-weight: bold;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			pointer-events: none;

			i {
				margin-right: 10px;
			}

			@media (max-width: 500px) {
				line-height: $height-narrow;
				padding-left: 16px;
			}
		}

		> button + .title {
			padding-left: 0;
		}
	}

	> .footer {
		display: flex;
		flex-shrink: 0;
		box-shadow: 0px -1px var(--divider);

		> button {
			height: $height;
			width: $height;
			font-size: math.div($height, 3);

			@media (max-width: 500px) {
				height: $height-narrow;
				width: $height-narrow;
			}
		}

		> .content {
			flex: 1;
			line-height: $height;
			font-weight: bold;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			text-align: center;

			@media (max-width: 500px) {
				line-height: $height-narrow;
				// padding-left: 16px;
			}
		}

		> button + .title {
			padding-left: 0;
		}
	}

	> .body {
		overflow: auto;
		height: 100%;
	}
}
</style>
