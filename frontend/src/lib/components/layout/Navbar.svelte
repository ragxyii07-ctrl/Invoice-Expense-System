<script>
	import { Menu, Bell, Search, LogOut, Trash2 } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores/auth.store';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	import {
		getNotificationsByUser,
		markAllNotificationsAsRead,
		deleteNotification
	} from '$lib/services/notification.service';

	import { notifications, unreadNotificationCount } from '$lib/stores/notification.store';

	let { userEmail = '', onMenuClick = () => {} } = $props();

	let showNotifications = $state(false);

	async function loadNotifications() {
		const user = get(currentUser);
		if (!user) return;

		const data = await getNotificationsByUser(user.uid);
		notifications.set(data);
	}

	async function handleToggleNotifications() {
		showNotifications = !showNotifications;

		const user = get(currentUser);

		if (showNotifications && user) {
			await markAllNotificationsAsRead(user.uid);
			await loadNotifications();
		}
	}

	async function handleDeleteNotification(id) {
		await deleteNotification(id);
		await loadNotifications();
	}

	async function handleLogout() {
	const user = get(currentUser);

	if (user) {
		sessionStorage.setItem(
			'logoutUserName',
			user.displayName || user.email?.split('@')[0] || userEmail || 'User'
		);
	}

	await goto('/logout');
}

	onMount(() => {
		loadNotifications();
	});
</script>

<header class="flex h-16 items-center justify-between border-b bg-white px-6">
	<div class="flex items-center gap-4">
		<button class="lg:hidden" onclick={onMenuClick}>
			<Menu size={24} />
		</button>

		<div class="relative hidden md:block">
			<Search class="absolute left-3 top-2.5 text-slate-400" size={18} />
			<input
				placeholder="Search invoices, customers..."
				class="w-80 rounded-xl border bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
	</div>

	<div class="flex items-center gap-4">
		<div class="relative">
			<button
				type="button"
				onclick={handleToggleNotifications}
				class="relative rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
			>
				<Bell size={20} />

				{#if $unreadNotificationCount > 0}
					<span class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
						{$unreadNotificationCount}
					</span>
				{/if}
			</button>

			{#if showNotifications}
				<div class="absolute right-0 top-12 z-50 w-80 rounded-2xl border bg-white p-4 shadow-xl">
					<div class="mb-3 flex items-center justify-between">
						<h3 class="font-bold text-slate-900">Notifications</h3>
						<button type="button" class="text-xs text-blue-600" onclick={loadNotifications}>
							Refresh
						</button>
					</div>

					{#if $notifications.length === 0}
						<p class="text-sm text-slate-500">No notifications yet.</p>
					{:else}
						<div class="max-h-80 space-y-2 overflow-y-auto">
							{#each $notifications as item (item.id)}
								<div class="flex items-start justify-between gap-2 rounded-xl bg-slate-50 p-3">
									<div>
										<p class="text-sm font-medium text-slate-800">{item.message}</p>
										<p class="mt-1 text-xs text-slate-500">{item.type || 'info'}</p>
									</div>

									<button
										type="button"
										onclick={() => handleDeleteNotification(item.id)}
										class="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
									>
										<Trash2 size={14} />
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<div class="hidden text-right sm:block">
			<p class="text-sm font-semibold text-slate-900">{userEmail}</p>
			<p class="text-xs text-slate-500">Business Owner</p>
		</div>

		<button
			type="button"
			onclick={handleLogout}
			class="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
		>
			<LogOut size={17} />
			Logout
		</button>
	</div>
</header>