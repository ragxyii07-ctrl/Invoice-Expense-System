import { writable, derived } from 'svelte/store';

export const notifications = writable([]);

export const unreadNotifications = derived(notifications, ($notifications) =>
	$notifications.filter((item) => !item.isRead)
);

export const unreadNotificationCount = derived(
	unreadNotifications,
	($unreadNotifications) => $unreadNotifications.length
);