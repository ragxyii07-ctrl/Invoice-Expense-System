<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase/firebase';
	import { getBusinessSettings } from '$lib/services/settings.service';
	import { Building2 } from 'lucide-svelte';

	let welcomeName = $state('User');
	let welcomeLogo = $state('');

	onMount(async () => {
		const user = auth.currentUser;

		if (user) {
			welcomeName = user.email?.split('@')[0] || 'User';

			try {
				const settings = await getBusinessSettings(user.uid);
				welcomeName = settings?.ownerName || welcomeName;
				welcomeLogo = settings?.logoUrl || '';
			} catch {
				welcomeLogo = '';
			}
		}

		setTimeout(() => {
			goto('/dashboard', { replaceState: true });
		}, 2000);
	});
</script>

<section class="flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-4">
	<div class="absolute h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
	<div class="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl"></div>

	<div class="relative w-full max-w-lg rounded-3xl border border-white/30 bg-white/15 p-10 text-center text-white shadow-2xl backdrop-blur-xl">
		{#if welcomeLogo}
			<img src={welcomeLogo} alt="Company Logo" class="mx-auto mb-6 h-24 w-24 rounded-3xl border-4 border-white/40 bg-white object-cover shadow-xl" />
		{:else}
			<div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 shadow-xl">
				<Building2 size={42} />
			</div>
		{/if}

		<h1 class="text-4xl font-extrabold">Welcome Back</h1>
		<p class="mt-3 text-2xl font-bold">{welcomeName}</p>
		<p class="mt-4 text-lg text-blue-100">Welcome to Invoice & Expense Management System</p>

		<div class="mx-auto mt-8 h-2 w-56 overflow-hidden rounded-full bg-white/30">
			<div class="h-full w-full animate-pulse rounded-full bg-white"></div>
		</div>
	</div>
</section>