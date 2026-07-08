<script>
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { currentUser } from '$lib/stores/auth.store';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	import {
		getBusinessSettings,
		saveBusinessSettings,
		fileToBase64
	} from '$lib/services/settings.service';

	import {
		Building2,
		User,
		Mail,
		Phone,
		MapPin,
		BadgePercent,
		ReceiptText,
		Save,
		ImagePlus
	} from 'lucide-svelte';

	let loading = $state(false);
	let error = $state('');
	let success = $state('');

	let businessName = $state('');
	let ownerName = $state('');
	let email = $state('');
	let phone = $state('');
	let gstNumber = $state('');
	let address = $state('');
	let invoicePrefix = $state('INV');

	let logoUrl = $state('');
	let logoPreview = $state('');

	async function loadSettings() {
		const user = get(currentUser);
		if (!user) return;

		try {
			loading = true;
			error = '';

			const settings = await getBusinessSettings(user.uid);

			if (settings) {
				businessName = settings.businessName || '';
				ownerName = settings.ownerName || '';
				email = settings.email || user.email || '';
				phone = settings.phone || '';
				gstNumber = settings.gstNumber || '';
				invoicePrefix = settings.invoicePrefix || 'INV';
				address = settings.address || '';
				logoUrl = settings.logoUrl || '';
				logoPreview = settings.logoUrl || '';
			} else {
				email = user.email || '';
			}
		} catch (err) {
			error = err.message || 'Failed to load settings';
		} finally {
			loading = false;
		}
	}

	async function handleLogoUpload(event) {
		error = '';
		success = '';

		const file = event.target.files?.[0];
		if (!file) return;

		const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

		if (!allowedTypes.includes(file.type)) {
			error = 'Only PNG, JPG, JPEG, WEBP images allowed';
			event.target.value = '';
			return;
		}

		if (file.size > 250 * 1024) {
			error = 'Image size must be below 250KB for Firestore Base64 storage';
			event.target.value = '';
			return;
		}

		try {
			const base64 = await fileToBase64(file);

			logoUrl = base64;
			logoPreview = base64;

			success = 'Logo selected successfully. Click Save Settings to store it.';
		} catch (err) {
			error = err.message || 'Logo upload failed';
		}
	}

	function removeLogo() {
		logoUrl = '';
		logoPreview = '';
		success = 'Logo removed. Click Save Settings to update.';
	}

	async function handleSaveSettings() {
		error = '';
		success = '';

		const user = get(currentUser);

		if (!user) {
			error = 'Please login again';
			return;
		}

		if (!businessName || !ownerName || !email || !phone || !address) {
			error = 'Business name, owner name, email, phone and address are required';
			return;
		}

		try {
			loading = true;

			await saveBusinessSettings(user.uid, {
				businessName,
				ownerName,
				email,
				phone,
				gstNumber,
				invoicePrefix,
				address,
				logoUrl
			});

			logoPreview = logoUrl;
			success = 'Business settings saved successfully';
		} catch (err) {
			error = err.message || 'Failed to save settings';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		const unsubscribe = currentUser.subscribe((user) => {
			if (user) loadSettings();
		});

		return () => unsubscribe();
	});
</script>

<AppShell userEmail={$currentUser?.email || 'user@example.com'}>
	<div class="mb-8">
		<h2 class="text-3xl font-bold text-slate-900">Settings</h2>
		<p class="mt-1 text-slate-500">Manage your business profile and invoice settings</p>
	</div>

	<div class="grid gap-6 xl:grid-cols-3">
		<div class="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">
			<div class="mb-6 flex items-center gap-3">
				<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
					<Building2 size={22} />
				</div>

				<div>
					<h3 class="text-xl font-bold text-slate-900">Business Information</h3>
					<p class="text-sm text-slate-500">This information will be used in invoices</p>
				</div>
			</div>

			{#if error}
				<p class="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
			{/if}

			{#if success}
				<p class="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">{success}</p>
			{/if}

			<div class="mb-6 rounded-2xl border bg-slate-50 p-5">
				<h3 class="mb-4 text-lg font-bold text-slate-900">Company Logo</h3>

				<div class="flex flex-col gap-4 md:flex-row md:items-center">
					<div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border bg-white">
						{#if logoPreview || logoUrl}
							<img
								src={logoPreview || logoUrl}
								alt="Company Logo"
								class="h-full w-full object-cover"
							/>
						{:else}
							<ImagePlus class="text-slate-400" size={34} />
						{/if}
					</div>

					<div class="flex flex-col gap-2">
						<label class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
							<ImagePlus size={18} />
							Upload Logo
							<input
								type="file"
								accept="image/png,image/jpeg,image/jpg,image/webp"
								class="hidden"
								onchange={handleLogoUpload}
							/>
						</label>

						{#if logoPreview || logoUrl}
							<button
								type="button"
								onclick={removeLogo}
								class="rounded-xl bg-red-50 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
							>
								Remove Logo
							</button>
						{/if}

						<p class="text-sm text-slate-500">
							PNG, JPG, JPEG, WEBP only. Max size 250KB. Free Firestore Base64 method.
						</p>
					</div>
				</div>
			</div>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSaveSettings();
				}}
				class="space-y-4"
			>
				<div class="grid gap-4 md:grid-cols-2">
					<div class="relative">
						<Building2 class="absolute left-3 top-3 text-slate-400" size={19} />
						<input
							bind:value={businessName}
							placeholder="Business Name"
							class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div class="relative">
						<User class="absolute left-3 top-3 text-slate-400" size={19} />
						<input
							bind:value={ownerName}
							placeholder="Owner Name"
							class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div class="relative">
						<Mail class="absolute left-3 top-3 text-slate-400" size={19} />
						<input
							type="email"
							bind:value={email}
							placeholder="Business Email"
							class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div class="relative">
						<Phone class="absolute left-3 top-3 text-slate-400" size={19} />
						<input
							bind:value={phone}
							placeholder="Phone Number"
							class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div class="relative">
						<BadgePercent class="absolute left-3 top-3 text-slate-400" size={19} />
						<input
							bind:value={gstNumber}
							placeholder="GST Number"
							class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div class="relative">
						<ReceiptText class="absolute left-3 top-3 text-slate-400" size={19} />
						<input
							bind:value={invoicePrefix}
							placeholder="Invoice Prefix"
							class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				<div class="relative">
					<MapPin class="absolute left-3 top-3 text-slate-400" size={19} />
					<textarea
						bind:value={address}
						placeholder="Business Address"
						rows="4"
						class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
					></textarea>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
				>
					<Save size={18} />
					{loading ? 'Saving...' : 'Save Settings'}
				</button>
			</form>
		</div>

		<div class="rounded-2xl bg-white p-6 shadow-sm">
			<h3 class="text-xl font-bold text-slate-900">Preview</h3>
			<p class="mt-1 text-sm text-slate-500">Invoice business header preview</p>

			<div class="mt-6 rounded-2xl border bg-slate-50 p-5">
				{#if logoPreview || logoUrl}
					<img
						src={logoPreview || logoUrl}
						alt="Business Logo"
						class="mb-4 h-16 w-16 rounded-xl object-cover"
					/>
				{/if}

				<h4 class="text-2xl font-bold text-slate-900">
					{businessName || 'Your Business Name'}
				</h4>

				<p class="mt-2 text-sm text-slate-600">{ownerName || 'Owner Name'}</p>
				<p class="text-sm text-slate-600">{email || 'business@email.com'}</p>
				<p class="text-sm text-slate-600">{phone || 'Phone Number'}</p>

				{#if gstNumber}
					<p class="mt-2 text-sm font-semibold text-slate-700">GST: {gstNumber}</p>
				{/if}

				<p class="mt-3 text-sm text-slate-600">{address || 'Business Address'}</p>

				<div class="mt-5 rounded-xl bg-white p-4">
					<p class="text-sm text-slate-500">Next Invoice Format</p>
					<p class="text-xl font-bold text-blue-600">{invoicePrefix || 'INV'}-0001</p>
				</div>
			</div>
		</div>
	</div>
</AppShell>
