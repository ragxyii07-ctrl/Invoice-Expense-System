<script>
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { currentUser } from '$lib/stores/auth.store';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	import {
		addInvoice,
		getInvoicesByUser,
		updateInvoiceStatus,
		deleteInvoice,
		sendInvoiceEmail
	} from '$lib/services/invoice.service';

	import { getCustomersByUser } from '$lib/services/customer.service';
	import { getBusinessSettings } from '$lib/services/settings.service';
	import { downloadInvoicePDF } from '$lib/services/pdf.service';

	import {
		Plus,
		Trash2,
		ReceiptText,
		Calendar,
		User,
		FileText,
		Download
	} from 'lucide-svelte';

	let invoices = $state([]);
	let customers = $state([]);
	let loading = $state(false);
	let error = $state('');
	let success = $state('');

	let customerId = $state('');
	let invoiceDate = $state('');
	let dueDate = $state('');
	let gst = $state(18);
	let notes = $state('');
	let items = $state([{ product: '', qty: 1, price: 0 }]);

	let subtotal = $derived(
		items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0)
	);

	let taxAmount = $derived((subtotal * Number(gst || 0)) / 100);
	let grandTotal = $derived(subtotal + taxAmount);

	function generateInvoiceNo() {
		return `INV-${String(invoices.length + 1).padStart(4, '0')}`;
	}

	function formatCurrency(value) {
		return `₹${Number(value || 0).toLocaleString('en-IN')}`;
	}

	function getStatusClass(status) {
		if (status === 'Paid') return 'bg-green-50 text-green-700 border-green-200';
		if (status === 'Overdue') return 'bg-red-50 text-red-700 border-red-200';
		return 'bg-yellow-50 text-yellow-700 border-yellow-200';
	}

	async function loadData() {
		const user = get(currentUser);
		if (!user) return;

		try {
			loading = true;
			error = '';
			customers = await getCustomersByUser();
			invoices = await getInvoicesByUser();
		} catch (err) {
			error = err.message || 'Failed to load invoice data';
		} finally {
			loading = false;
		}
	}

	function addItem() {
		items = [...items, { product: '', qty: 1, price: 0 }];
	}

	function removeItem(index) {
		if (items.length === 1) return;
		items = items.filter((_, i) => i !== index);
	}

	function resetForm() {
		customerId = '';
		invoiceDate = '';
		dueDate = '';
		gst = 18;
		notes = '';
		items = [{ product: '', qty: 1, price: 0 }];
	}

	async function handleAddInvoice() {
		error = '';
		success = '';

		const user = get(currentUser);

		if (!user) {
			error = 'Please login again';
			return;
		}

		if (!customerId || !invoiceDate || !dueDate) {
			error = 'Customer, invoice date and due date are required';
			return;
		}

		if (items.some((item) => !item.product || Number(item.qty) <= 0 || Number(item.price) <= 0)) {
			error = 'Please enter valid item details';
			return;
		}

		const selectedCustomer = customers.find((customer) => customer.id === customerId);

		try {
			loading = true;

			await addInvoice({
				userId: user.uid,
				invoiceNo: generateInvoiceNo(),
				customerId,
				customerName: selectedCustomer?.name || '',
				customerEmail: selectedCustomer?.email || '',
				invoiceDate,
				dueDate,
				items: items.map((item) => ({
					product: item.product,
					qty: Number(item.qty),
					price: Number(item.price),
					total: Number(item.qty) * Number(item.price)
				})),
				subtotal,
				gst: Number(gst),
				taxAmount,
				grandTotal,
				notes,
				status: 'Pending'
			});

			success = 'Invoice created successfully';
			resetForm();
			await loadData();
		} catch (err) {
			error = err.message || 'Failed to create invoice';
		} finally {
			loading = false;
		}
	}

	async function handleStatusChange(invoiceId, status) {
		try {
			loading = true;
			error = '';
			await updateInvoiceStatus(invoiceId, status);
			await loadData();
		} catch (err) {
			error = err.message || 'Failed to update status';
		} finally {
			loading = false;
		}
	}

	async function handleDeleteInvoice(invoiceId) {
		if (!confirm('Are you sure you want to delete this invoice?')) return;

		try {
			loading = true;
			error = '';
			await deleteInvoice(invoiceId);
			await loadData();
		} catch (err) {
			error = err.message || 'Failed to delete invoice';
		} finally {
			loading = false;
		}
	}

	async function handleDownloadPDF(invoice) {
		const user = get(currentUser);

		if (!user) {
			alert('Please login again');
			return;
		}

		try {
			const settings = await getBusinessSettings(user.uid);
			downloadInvoicePDF(invoice, settings || {});
		} catch (err) {
			alert(err.message || 'PDF download failed');
		}
	}

async function handleSendEmail(invoice) {
	if (!invoice?.id) {
		alert('Invoice ID not found');
		return;
	}

	const customer = customers.find((item) => item.id === invoice.customerId);
	const email = invoice.customerEmail || customer?.email;

	if (!email) {
		alert('Customer email not found');
		return;
	}

	try {
		loading = true;

		await sendInvoiceEmail(invoice.id);

		alert('Invoice email sent successfully');
	} catch (err) {
		alert(err.message || 'Failed to send invoice email');
	} finally {
		loading = false;
	}
}

	onMount(() => {
		const unsubscribe = currentUser.subscribe((user) => {
			if (user) loadData();
		});

		return () => unsubscribe();
	});
</script>

<AppShell userEmail={$currentUser?.email || 'user@example.com'}>
	<div class="mb-8">
		<h2 class="text-3xl font-bold text-slate-900">Invoices</h2>
		<p class="mt-1 text-slate-500">Create and manage customer invoices</p>
	</div>

	<div class="grid gap-6 xl:grid-cols-3">
		<div class="rounded-2xl bg-white p-6 shadow-sm">
			<div class="mb-6 flex items-center gap-3">
				<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
					<ReceiptText size={22} />
				</div>
				<div>
					<h3 class="text-xl font-bold text-slate-900">Create Invoice</h3>
					<p class="text-sm text-slate-500">Add a new invoice</p>
				</div>
			</div>

			{#if error}
				<p class="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
			{/if}

			{#if success}
				<p class="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">{success}</p>
			{/if}

			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleAddInvoice();
				}}
				class="space-y-4"
			>
				<div class="relative">
					<User class="absolute left-3 top-3 text-slate-400" size={19} />
					<select
						bind:value={customerId}
						class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Select Customer</option>
						{#each customers as customer (customer.id)}
							<option value={customer.id}>{customer.name}</option>
						{/each}
					</select>
				</div>

				<div class="relative">
					<Calendar class="absolute left-3 top-3 text-slate-400" size={19} />
					<input
						type="date"
						bind:value={invoiceDate}
						class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div class="relative">
					<Calendar class="absolute left-3 top-3 text-slate-400" size={19} />
					<input
						type="date"
						bind:value={dueDate}
						class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<h4 class="mb-2 text-sm font-semibold text-slate-700">Invoice Items</h4>

					{#each items as item, index (index)}
						<div class="mb-3 rounded-xl border p-3">
							<input
								bind:value={item.product}
								placeholder="Product / Service"
								class="mb-2 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
							/>

							<div class="grid grid-cols-3 gap-2">
								<input
									type="number"
									min="1"
									bind:value={item.qty}
									placeholder="Qty"
									class="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
								/>

								<input
									type="number"
									min="0"
									bind:value={item.price}
									placeholder="Price"
									class="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
								/>

								<button
									type="button"
									onclick={() => removeItem(index)}
									class="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
								>
									Remove
								</button>
							</div>
						</div>
					{/each}

					<button
						type="button"
						onclick={addItem}
						class="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
					>
						<Plus size={16} />
						Add Item
					</button>
				</div>

				<div>
					<h4 class="mb-2 text-sm font-semibold text-slate-700">GST (%)</h4>
					<input
						type="number"
						min="0"
						max="100"
						bind:value={gst}
						class="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div class="rounded-xl bg-slate-50 p-4 text-sm">
					<div class="flex justify-between">
						<span>Subtotal</span>
						<strong>{formatCurrency(subtotal)}</strong>
					</div>
					<div class="mt-2 flex justify-between">
						<span>GST Amount</span>
						<strong>{formatCurrency(taxAmount)}</strong>
					</div>
					<div class="mt-3 flex justify-between border-t pt-3 text-lg">
						<span>Grand Total</span>
						<strong>{formatCurrency(grandTotal)}</strong>
					</div>
				</div>

				<div class="relative">
					<FileText class="absolute left-3 top-3 text-slate-400" size={19} />
					<textarea
						bind:value={notes}
						placeholder="Notes"
						rows="3"
						class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
					></textarea>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
				>
					<Plus size={18} />
					{loading ? 'Saving...' : 'Create Invoice'}
				</button>
			</form>
		</div>

		<div class="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">
			<div class="mb-6">
				<h3 class="text-xl font-bold text-slate-900">Invoice List</h3>
				<p class="text-sm text-slate-500">Total Invoices: {invoices.length}</p>
			</div>

			{#if loading}
				<p class="text-slate-500">Loading invoices...</p>
			{:else if invoices.length === 0}
				<div class="rounded-2xl border border-dashed p-10 text-center">
					<ReceiptText class="mx-auto text-slate-400" size={42} />
					<h4 class="mt-4 text-lg font-bold text-slate-900">No invoices found</h4>
					<p class="mt-1 text-slate-500">Create your first invoice to get started.</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-left">
						<thead>
							<tr class="border-b text-sm text-slate-500">
								<th class="py-3">Invoice No</th>
								<th class="py-3">Customer</th>
								<th class="py-3">Date</th>
								<th class="py-3">Amount</th>
								<th class="py-3">Status</th>
								<th class="py-3 text-right">Action</th>
							</tr>
						</thead>

						<tbody>
							{#each invoices as invoice (invoice.id)}
								<tr class="border-b text-sm">
									<td class="py-4 font-semibold text-slate-900">{invoice.invoiceNo}</td>
									<td class="py-4 text-slate-600">{invoice.customerName}</td>
									<td class="py-4 text-slate-600">{invoice.invoiceDate}</td>
									<td class="py-4 font-semibold text-slate-900">{formatCurrency(invoice.grandTotal)}</td>
									<td class="py-4">
										<select
											value={invoice.status || 'Pending'}
											onchange={(event) => handleStatusChange(invoice.id, event.target.value)}
											class={`rounded-full border px-3 py-1 text-xs font-semibold outline-none ${getStatusClass(invoice.status)}`}
										>
											<option value="Pending">Pending</option>
											<option value="Paid">Paid</option>
											<option value="Overdue">Overdue</option>
										</select>
									</td>

									<td class="py-4 text-right">
										<div class="flex justify-end gap-2">
											<button
												type="button"
												onclick={() => handleDownloadPDF(invoice)}
												class="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100"
												title="Download PDF"
											>
												<Download size={17} />
											</button>

											<button
												type="button"
												onclick={() => handleSendEmail(invoice)}
												class="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
												title="Send Email"
											>
												📧
											</button>

											<button
												type="button"
												onclick={() => handleDeleteInvoice(invoice.id)}
												class="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
												title="Delete Invoice"
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
