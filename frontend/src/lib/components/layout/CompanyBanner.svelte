<script>
	import { currentUser } from '$lib/stores/auth.store';
	import { getBusinessSettings } from '$lib/services/settings.service';
	import { Building2, Sparkles } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let businessName = $state('InvoicePro');
	let ownerName = $state('Business Owner');
	let logoUrl = $state('');

	async function loadBusiness() {
		const user = get(currentUser);
		if (!user) return;

		const settings = await getBusinessSettings(user.uid);

		if (settings) {
			businessName = settings.businessName || 'InvoicePro';
			ownerName = settings.ownerName || user.email;
			logoUrl = settings.logoUrl || '';
		}
	}

	onMount(loadBusiness);
</script>

<div
	class="mx-4 hidden flex-1 items-center justify-center rounded-2xl bg-linear-to-r from-indigo-600 via-blue-600 to-pink-500 px-6 py-3 text-white shadow-lg lg:flex"
>
	<div class="flex items-center gap-4">
		<div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white/20 shadow">
			{#if logoUrl}
				<img src={logoUrl} alt="Company Logo" class="h-full w-full object-cover" />
			{:else}
				<Building2 size={26} />
			{/if}
		</div>

		<div class="text-center">
			<h2 class="text-xl font-extrabold tracking-wide">
				{businessName}
			</h2>

			<p class="flex items-center justify-center gap-1 text-sm text-blue-100">
				<Sparkles size={14} />
				Welcome {ownerName}
			</p>
		</div>
	</div>
</div>