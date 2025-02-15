<template>
<div>
	<MkTab v-model:value="tab" v-if="$i" :class="{ 'friendly': isFriendlyUI || isFriendlyUILegacy }">
		<option value="featured"><i class="fas fa-fire-alt"></i> {{ $ts._pages.featured }}</option>
		<option value="my"><i class="fas fa-edit"></i> {{ $ts._pages.my }}</option>
		<option value="liked"><i class="fas fa-heart"></i> {{ $ts._pages.liked }}</option>
	</MkTab>

	<div class="_section">
		<div class="rknalgpo _content" v-if="tab === 'featured'">
			<MkPagination :pagination="featuredPagesPagination" #default="{items}">
				<MkPagePreview v-for="page in items" class="ckltabjg" :page="page" :key="page.id"/>
			</MkPagination>
		</div>

		<div class="rknalgpo _content my" v-if="tab === 'my'">
			<MkButton v-if="(isWideTablet || isDesktop) && (isFriendlyUI || isFriendlyUILegacy) || !(isFriendlyUI || isFriendlyUILegacy)" class="new" @click="create()"><i class="fas fa-plus"></i></MkButton>
			<MkPagination :pagination="myPagesPagination" #default="{items}">
				<MkPagePreview v-for="page in items" class="ckltabjg" :page="page" :key="page.id"/>
			</MkPagination>
		</div>

		<div class="rknalgpo _content" v-if="tab === 'liked'">
			<MkPagination :pagination="likedPagesPagination" #default="{items}">
				<MkPagePreview v-for="like in items" class="ckltabjg" :page="like.page" :key="like.page.id"/>
			</MkPagination>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MkPagePreview from '@client/components/page-preview.vue';
import MkPagination from '@client/components/ui/pagination.vue';
import MkButton from '@client/components/ui/button.vue';
import MkTab from '@client/components/tab.vue';
import * as symbols from '@client/symbols';

const DESKTOP_THRESHOLD = 1100;
const WIDE_TABLET_THRESHOLD = 850;

export default defineComponent({
	components: {
		MkPagePreview, MkPagination, MkButton, MkTab
	},
	data() {
		return {
			[symbols.PAGE_INFO]: {
				title: this.$ts.pages,
				icon: 'fas fa-sticky-note',
				action: {
					icon: 'fas fa-plus',
					text: this.$ts.create,
					handler: this.create
				}
			},
			tab: 'featured',
			featuredPagesPagination: {
				endpoint: 'pages/featured',
				noPaging: true,
			},
			myPagesPagination: {
				endpoint: 'i/pages',
				limit: 5,
			},
			likedPagesPagination: {
				endpoint: 'i/page-likes',
				limit: 5,
			},
			isWideTablet: window.innerWidth >= WIDE_TABLET_THRESHOLD,
			isDesktop: window.innerWidth >= DESKTOP_THRESHOLD,
			isFriendlyUI: localStorage.getItem('ui') == "friendly",
			isFriendlyUILegacy: localStorage.getItem('ui') == "friendly-legacy",
		};
	},

	methods: {
		create() {
			this.$router.push(`/pages/new`);
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

.rknalgpo {
	.ckltabjg {
		margin: 0;
	}

	&.my .ckltabjg:first-child {
		margin-top: 16px;
	}

	.ckltabjg:not(:last-child) {
		margin-bottom: 8px;
	}

	@media (min-width: 500px) {
		.ckltabjg:not(:last-child) {
			margin-bottom: 16px;
		}
	}
}
</style>
