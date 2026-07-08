<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { currentUser, authLoading } from '$lib/stores/auth.store';
	import AppSplash from '$lib/components/AppSplash.svelte';

	let { children } = $props();

	let splashLoading = $state(true);

	const publicRoutes = [
		'/',
		'/login',
		'/register',
		'/logout',
		'/session-expired',
		'/welcome'
	];

	let isPublicRoute = $derived(
		publicRoutes.some((route) => $page.url.pathname.startsWith(route))
	);

	$effect(() => {
		if ($authLoading) return;

		if (!$currentUser && !isPublicRoute) {
			goto('/login', { replaceState: true });
			return;
		}
	});

	$effect(() => {
		if ($authLoading) return;

		if ($currentUser && $page.url.pathname === '/') {
			goto('/dashboard', { replaceState: true });
		}
	});

	$effect(() => {
		if (!$authLoading) {
			const timer = setTimeout(() => {
				splashLoading = false;
			}, 2000);

			return () => clearTimeout(timer);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if splashLoading || $authLoading}
	<AppSplash />
{:else}
	{@render children()}
{/if}