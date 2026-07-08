<script>
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { currentUser } from '$lib/stores/auth.store';
	import {
		addCustomer,
		getCustomersByUser,
		updateCustomer,
		deleteCustomer
	} from '$lib/services/customer.service';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import {
		Plus,
		Trash2,
		Users,
		Mail,
		Phone,
		MapPin,
		Building2,
		Pencil,
		X,
		Search
	} from 'lucide-svelte';

	let customers = $state([]);
	let loading = $state(false);
	let error = $state('');
	let success = $state('');
	let searchText = $state('');

	let editingId = $state(null);
	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let company = $state('');
	let address = $state('');

	let filteredCustomers = $derived(
		customers.filter((customer) => {
			const text = searchText.toLowerCase();

			return (
				customer.name?.toLowerCase().includes(text) ||
				customer.email?.toLowerCase().includes(text) ||
				customer.phone?.toLowerCase().includes(text) ||
				customer.company?.toLowerCase().includes(text)
			);
		})
	);

	async function loadCustomers() {
		const user = get(currentUser);

		if (!user) return;

		try {
			loading = true;
			customers = await getCustomersByUser(user.uid);
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function resetForm() {
		editingId = null;
		name = '';
		email = '';
		phone = '';
		company = '';
		address = '';
	}

	function startEdit(customer) {
		editingId = customer.id;
		name = customer.name || '';
		email = customer.email || '';
		phone = customer.phone || '';
		company = customer.company || '';
		address = customer.address || '';
		success = '';
		error = '';
	}

	async function handleSubmitCustomer() {
		error = '';
		success = '';

		if (!name || !email || !phone) {
			error = 'Name, email and phone are required';
			return;
		}

		const user = get(currentUser);

		if (!user) {
			error = 'Please login again';
			return;
		}

		try {
			loading = true;

			if (editingId) {
				await updateCustomer(editingId, {
					name,
					email,
					phone,
					company,
					address
				});

				success = 'Customer updated successfully';
			} else {
				await addCustomer({
					userId: user.uid,
					name,
					email,
					phone,
					company,
					address
				});

				success = 'Customer added successfully';
			}

			resetForm();
			await loadCustomers();
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	async function handleDeleteCustomer(customerId) {
		const confirmDelete = confirm('Are you sure you want to delete this customer?');

		if (!confirmDelete) return;

		try {
			loading = true;
			await deleteCustomer(customerId);
			await loadCustomers();
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadCustomers();
	});
</script>

<AppShell userEmail={$currentUser?.email || 'user@example.com'}>
	<div class="mb-8">
		<h2 class="text-3xl font-bold text-slate-900">Customers</h2>
		<p class="mt-1 text-slate-500">Manage your business customers</p>
	</div>

	<div class="grid gap-6 xl:grid-cols-3">
		<div class="rounded-2xl bg-white p-6 shadow-sm">
			<div class="mb-6 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
						{#if editingId}
							<Pencil size={22} />
						{:else}
							<Plus size={22} />
						{/if}
					</div>

					<div>
						<h3 class="text-xl font-bold text-slate-900">
							{editingId ? 'Edit Customer' : 'Add Customer'}
						</h3>
						<p class="text-sm text-slate-500">
							{editingId ? 'Update customer details' : 'Create a new customer'}
						</p>
					</div>
				</div>

				{#if editingId}
					<button onclick={resetForm} class="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
						<X size={18} />
					</button>
				{/if}
			</div>

			{#if error}
				<p class="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
			{/if}

			{#if success}
				<p class="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">{success}</p>
			{/if}

			<form onsubmit={handleSubmitCustomer} class="space-y-4">
				<div class="relative">
					<Users class="absolute left-3 top-3 text-slate-400" size={19} />
					<input
						bind:value={name}
						placeholder="Customer Name"
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

				<div class="relative">
					<Building2 class="absolute left-3 top-3 text-slate-400" size={19} />
					<input
						bind:value={company}
						placeholder="Company Name"
						class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div class="relative">
					<MapPin class="absolute left-3 top-3 text-slate-400" size={19} />
					<textarea
						bind:value={address}
						placeholder="Address"
						rows="3"
						class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
					></textarea>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
				>
					{#if editingId}
						<Pencil size={18} />
						{loading ? 'Updating...' : 'Update Customer'}
					{:else}
						<Plus size={18} />
						{loading ? 'Saving...' : 'Add Customer'}
					{/if}
				</button>
			</form>
		</div>

		<div class="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">
			<div class="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
				<div>
					<h3 class="text-xl font-bold text-slate-900">Customer List</h3>
					<p class="text-sm text-slate-500">Total Customers: {filteredCustomers.length}</p>
				</div>

				<div class="relative">
					<Search class="absolute left-3 top-2.5 text-slate-400" size={18} />
					<input
						bind:value={searchText}
						placeholder="Search customers..."
						class="w-full rounded-xl border bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 md:w-72"
					/>
				</div>
			</div>

			{#if loading}
				<p class="text-slate-500">Loading customers...</p>
			{:else if filteredCustomers.length === 0}
				<div class="rounded-2xl border border-dashed p-10 text-center">
					<Users class="mx-auto text-slate-400" size={42} />
					<h4 class="mt-4 text-lg font-bold text-slate-900">No customers found</h4>
					<p class="mt-1 text-slate-500">Add or search another customer.</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-left">
						<thead>
							<tr class="border-b text-sm text-slate-500">
								<th class="py-3">Name</th>
								<th class="py-3">Email</th>
								<th class="py-3">Phone</th>
								<th class="py-3">Company</th>
								<th class="py-3 text-right">Action</th>
							</tr>
						</thead>

						<tbody>
							{#each filteredCustomers as customer (customer.id)}
								<tr class="border-b text-sm">
									<td class="py-4 font-semibold text-slate-900">{customer.name}</td>
									<td class="py-4 text-slate-600">{customer.email}</td>
									<td class="py-4 text-slate-600">{customer.phone}</td>
									<td class="py-4 text-slate-600">{customer.company || '-'}</td>
									<td class="py-4">
										<div class="flex justify-end gap-2">
											<button
												onclick={() => startEdit(customer)}
												class="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
											>
												<Pencil size={17} />
											</button>

											<button
												onclick={() => handleDeleteCustomer(customer.id)}
												class="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
											>
												<Trash2 size={17} />
											</button>
										</div>
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