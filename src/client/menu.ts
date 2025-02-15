import { computed } from 'vue';
import { search } from '@client/scripts/search';
import * as os from '@client/os';
import { i18n } from '@client/i18n';
import { $i } from './account';
import { unisonReload } from '@client/scripts/unison-reload';

export const menuDef = {
	explore: {
		title: 'explore',
		icon: 'fas fa-hashtag',
		to: '/explore',
	},
	notifications: {
		title: 'notifications',
		icon: 'fas fa-bell',
		show: computed(() => $i != null),
		indicated: computed(() => $i != null && $i.hasUnreadNotification),
		to: '/my/notifications',
	},
	messaging: {
		title: 'messaging',
		icon: 'fas fa-comments',
		show: computed(() => $i != null),
		indicated: computed(() => $i != null && $i.hasUnreadMessagingMessage),
		to: '/my/messaging',
	},
	drive: {
		title: 'drive',
		icon: 'fas fa-cloud',
		show: computed(() => $i != null),
		to: '/my/drive',
	},
	followRequests: {
		title: 'followRequests',
		icon: 'fas fa-user-clock',
		show: computed(() => $i != null && $i.isLocked),
		indicated: computed(() => $i != null && $i.hasPendingReceivedFollowRequest),
		to: '/my/follow-requests',
	},
	featured: {
		title: 'featured',
		icon: 'fas fa-fire-alt',
		to: '/featured',
	},
	announcements: {
		title: 'announcements',
		icon: 'fas fa-bullhorn',
		indicated: computed(() => $i != null && $i.hasUnreadAnnouncement),
		to: '/announcements',
	},
	search: {
		title: 'search',
		icon: 'fas fa-search',
		action: () => search(),
	},
	lists: {
		title: 'lists',
		icon: 'fas fa-list-ul',
		show: computed(() => $i != null),
		to: '/my/lists',
	},
	groups: {
		title: 'groups',
		icon: 'fas fa-users',
		show: computed(() => $i != null),
		to: '/my/groups',
	},
	antennas: {
		title: 'antennas',
		icon: 'fas fa-satellite',
		show: computed(() => $i != null),
		to: '/my/antennas',
	},
	mentions: {
		title: 'mentions',
		icon: 'fas fa-at',
		show: computed(() => $i != null),
		indicated: computed(() => $i != null && $i.hasUnreadMentions),
		to: '/my/mentions',
	},
	messages: {
		title: 'directNotes',
		icon: 'fas fa-envelope',
		show: computed(() => $i != null),
		indicated: computed(() => $i != null && $i.hasUnreadSpecifiedNotes),
		to: '/my/messages',
	},
	favorites: {
		title: 'favorites',
		icon: 'fas fa-star',
		show: computed(() => $i != null),
		to: '/my/favorites',
	},
	pages: {
		title: 'pages',
		icon: 'fas fa-file-alt',
		to: '/pages',
	},
	gallery: {
		title: 'gallery',
		icon: 'fas fa-icons',
		to: '/gallery',
	},
	clips: {
		title: 'clip',
		icon: 'fas fa-paperclip',
		show: computed(() => $i != null),
		to: '/my/clips',
	},
	channels: {
		title: 'channel',
		icon: 'fas fa-satellite-dish',
		to: '/channels',
	},
	federation: {
		title: 'federation',
		icon: 'fas fa-globe',
		to: '/federation',
	},
	emojis: {
		title: 'emojis',
		icon: 'fas fa-laugh',
		to: '/emojis',
	},
	games: {
		title: 'games',
		icon: 'fas fa-gamepad',
		to: '/games/reversi',
	},
	scratchpad: {
		title: 'scratchpad',
		icon: 'fas fa-terminal',
		to: '/scratchpad',
	},
	rooms: {
		title: 'rooms',
		icon: 'fas fa-door-closed',
		show: computed(() => $i != null),
		to: computed(() => `/@${$i.username}/room`),
	},
	ui: {
		title: 'switchUi',
		icon: 'fas fa-columns',
		action: (ev) => {
			os.popupMenu([{
				text: i18n.locale.friendly,
				action: () => {
					localStorage.setItem('ui', 'friendly');
					unisonReload();
				}
			}, {
				text: i18n.locale.friendly + ' (legacy)',
				action: () => {
					localStorage.setItem('ui', 'friendly-legacy');
					unisonReload();
				}
			}, {
				text: i18n.locale.misskey,
				action: () => {
					localStorage.setItem('ui', 'misskey');
					unisonReload();
				}
			}, {
				text: i18n.locale.deck,
				action: () => {
					localStorage.setItem('ui', 'deck');
					unisonReload();
				}
			}, {
				text: 'pope',
				action: () => {
					localStorage.setItem('ui', 'pope');
					unisonReload();
				}
			}, {
				text: 'Chat (β)',
				action: () => {
					localStorage.setItem('ui', 'chat');
					unisonReload();
				}
			}, {
				text: i18n.locale.desktop + ' (β)',
				action: () => {
					localStorage.setItem('ui', 'desktop');
					unisonReload();
				}
			}], ev.currentTarget || ev.target);
		},
	},
	emojiSuggestion: {
		title: 'emojiSuggestion',
		icon: 'fas fa-laugh',
		to: '/emoji-suggestion',
	},
};
