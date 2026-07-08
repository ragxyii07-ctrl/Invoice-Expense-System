<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase/firebase';
	import { signOut } from 'firebase/auth';
	import { currentUser } from '$lib/stores/auth.store';
	import { get } from 'svelte/store';
	import { getBusinessSettings } from '$lib/services/settings.service';
	import ThankYouScreen from '$lib/components/ThankYouScreen.svelte';

	let userName = $state('User');
	let companyName = $state('InvoicePro');
	let logoUrl = $state('');

	onMount(async () => {
		const user = get(currentUser) || auth.currentUser;

		if (user) {
			userName = user.displayName || user.email?.split('@')[0] || 'User';

			try {
				const settings = await getBusinessSettings(user.uid);
				companyName = settings?.businessName || 'InvoicePro';
				logoUrl = settings?.logoUrl || '';
				userName = settings?.ownerName || userName;
			} catch {
				companyName = 'InvoicePro';
			}
		}

		setTimeout(async () => {
			await signOut(auth);
			await goto('/login');
		}, 3000);
	});
</script>

<ThankYouScreen {userName} {companyName} {logoUrl} />