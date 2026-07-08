<script>
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { logoutUser } from '$lib/services/auth.service';
	import { startIdleTimer } from '$lib/utils/idleTimer';

	let { userEmail = '', children } = $props();

	let sidebarOpen = $state(false);

	onMount(() => {
		const stopTimer = startIdleTimer(async () => {
			await logoutUser();
			await goto('/session-expired');
		}, 5);

		return () => stopTimer();
	});
</script>

<div class="flex min-h-screen bg-slate-100">
	<Sidebar bind:open={sidebarOpen} />

	<div class="flex min-w-0 flex-1 flex-col">
		<Navbar userEmail={userEmail} onMenuClick={() => (sidebarOpen = true)} />

		<main class="flex-1 p-6">
			{@render children()}
		</main>
	</div>
</div>