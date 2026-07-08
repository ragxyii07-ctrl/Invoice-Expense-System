<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase/firebase';
	import { currentUser } from '$lib/stores/auth.store';
	import { get } from 'svelte/store';
	import ThankYouScreen from '$lib/components/ThankYouScreen.svelte';

	let userName = $state('User');
	let companyName = $state('InvoicePro');
	let logoUrl = $state('');

	onMount(() => {
		const savedName = sessionStorage.getItem('logoutUserName');
		const savedCompany = sessionStorage.getItem('logoutCompanyName');
		const savedLogo = sessionStorage.getItem('logoutLogoUrl');
		const user = get(currentUser) || auth.currentUser;

		userName = savedName || user?.displayName || user?.email?.split('@')[0] || 'User';
		companyName = savedCompany || 'InvoicePro';
		logoUrl = savedLogo || '';

		setTimeout(async () => {
			await signOut(auth);
			sessionStorage.removeItem('logoutUserName');
			sessionStorage.removeItem('logoutCompanyName');
			sessionStorage.removeItem('logoutLogoUrl');
			await goto('/login');
		}, 3000);
	});
</script>

<ThankYouScreen userName={userName} companyName={companyName} logoUrl={logoUrl} />