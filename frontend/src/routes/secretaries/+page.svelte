<script>
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { currentUser } from '$lib/stores/auth.store';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	import { addSecretary, getSecretaries, deleteSecretary } from '$lib/services/secretary.service';

	import { UserPlus, Trash2, Search, Users, Mail, Phone } from 'lucide-svelte';

	let loading = $state(false);
	let error = $state('');
	let success = $state('');

	let secretaries = $state([]);

	let fullName = $state('');
	let email = $state('');
	let phone = $state('');
	let search = $state('');

	const filteredSecretaries = $derived(
		secretaries.filter((secretary) => {
			const text = search.toLowerCase();

			return (
				secretary.fullName?.toLowerCase().includes(text) ||
				secretary.email?.toLowerCase().includes(text) ||
				secretary.phone?.toLowerCase().includes(text)
			);
		})
	);

	async function loadSecretaries() {
		const user = get(currentUser);

		if (!user) return;

		try {
			loading = true;
			error = '';
			secretaries = await getSecretaries(user.uid);
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function resetForm() {
		fullName = '';
		email = '';
		phone = '';
	}

	async function handleAddSecretary() {
		const user = get(currentUser);

		error = '';
		success = '';

		if (!user) {
			error = 'Please login again';
			return;
		}

		if (!fullName || !email || !phone) {
			error = 'Full name, email and phone are required';
			return;
		}

		try {
			loading = true;

			await addSecretary({
				ownerId: user.uid,
				fullName,
				email,
				phone
			});

			success = 'Secretary added successfully';
			resetForm();
			await loadSecretaries();
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	async function handleDelete(id) {
		if (!confirm('Delete this secretary?')) return;

		try {
			loading = true;
			error = '';

			await deleteSecretary(id);
			await loadSecretaries();
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadSecretaries();
	});
</script>

<AppShell userEmail={$currentUser?.email || 'user@example.com'}>
	<div class="mb-8">
		<h2 class="text-3xl font-bold text-slate-900">Secretary Management</h2>
		<p class="mt-1 text-slate-500">Add and manage business secretaries</p>
	</div>

	{#if error}
		<p class="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
	{/if}

	{#if success}
		<p class="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">{success}</p>
	{/if}

	<div class="grid gap-6 lg:grid-cols-3">
		<div class="rounded-2xl bg-white p-6 shadow-sm">
			<div class="mb-6 flex items-center gap-3">
				<div class="rounded-xl bg-blue-100 p-3 text-blue-600">
					<UserPlus size={22} />
				</div>

				<div>
					<h3 class="text-xl font-bold text-slate-900">Add Secretary</h3>
					<p class="text-sm text-slate-500">Create secretary record</p>
				</div>
			</div>

			<form onsubmit={handleAddSecretary} class="space-y-4">
				<div class="relative">
					<Users class="absolute left-3 top-3 text-slate-400" size={19} />
					<input
						bind:value={fullName}
						placeholder="Full Name"
						class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div class="relative">
					<Mail class="absolute left-3 top-3 text-slate-400" size={19} />
					<input
						type="email"
						bind:value={email}
						placeholder="Email Address"
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

				<button
					type="submit"
					disabled={loading}
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
				>
					<UserPlus size={18} />
					{loading ? 'Saving...' : 'Add Secretary'}
				</button>
			</form>
		</div>

		<div class="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
			<div class="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
				<div>
					<h3 class="text-xl font-bold text-slate-900">Secretary List</h3>
					<p class="text-sm text-slate-500">Total Secretaries: {filteredSecretaries.length}</p>
				</div>

				<div class="relative">
					<Search class="absolute left-3 top-2.5 text-slate-400" size={18} />
					<input
						bind:value={search}
						placeholder="Search secretaries..."
						class="w-full rounded-xl border bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 md:w-72"
					/>
				</div>
			</div>

			{#if loading}
				<p class="text-slate-500">Loading secretaries...</p>
			{:else if filteredSecretaries.length === 0}
				<div class="rounded-2xl border border-dashed p-10 text-center">
					<Users class="mx-auto text-slate-400" size={42} />
					<h4 class="mt-4 text-lg font-bold text-slate-900">No secretaries found</h4>
					<p class="mt-1 text-slate-500">Add or search another secretary.</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-left">
						<thead>
							<tr class="border-b text-sm text-slate-500">
								<th class="py-3">Name</th>
								<th class="py-3">Email</th>
								<th class="py-3">Phone</th>
								<th class="py-3">Status</th>
								<th class="py-3 text-right">Action</th>
							</tr>
						</thead>

						<tbody>
							{#each filteredSecretaries as secretary (secretary.id)}
								<tr class="border-b text-sm">
									<td class="py-4 font-semibold text-slate-900">{secretary.fullName}</td>
									<td class="py-4 text-slate-600">{secretary.email}</td>
									<td class="py-4 text-slate-600">{secretary.phone}</td>
									<td class="py-4">
										<span class="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
											{secretary.status || 'active'}
										</span>
									</td>
									<td class="py-4 text-right">
										<button
											type="button"
											onclick={() => handleDelete(secretary.id)}
											class="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
										>
											<Trash2 size={17} />
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
</AppShell>