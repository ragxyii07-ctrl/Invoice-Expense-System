<script>
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { currentUser } from '$lib/stores/auth.store';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { getReportSummary } from '$lib/services/report.service';
	import { exportReportsToExcel } from '$lib/services/excel.service';
	import {
		BarChart3,
		ReceiptText,
		Wallet,
		Users,
		TrendingUp,
		AlertCircle,
		CheckCircle2,
		FileSpreadsheet
	} from 'lucide-svelte';

	let loading = $state(false);
	let error = $state('');

	let report = $state({
		totalCustomers: 0,
		totalInvoices: 0,
		totalExpensesCount: 0,
		totalRevenue: 0,
		totalExpenses: 0,
		netProfit: 0,
		pendingInvoices: 0,
		paidInvoices: 0,
		recentInvoices: [],
		recentExpenses: []
	});

	async function loadReports() {
		const user = get(currentUser);
		if (!user) return;

		try {
			loading = true;
			error = '';
			report = await getReportSummary(user.uid);
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function formatCurrency(value) {
		return `₹${Number(value || 0).toLocaleString('en-IN')}`;
	}

	function getStatusClass(status) {
		if (status === 'Paid') return 'bg-green-50 text-green-700';
		if (status === 'Overdue') return 'bg-red-50 text-red-700';
		return 'bg-yellow-50 text-yellow-700';
	}

	function handleExportExcel() {
		exportReportsToExcel(report);
	}

	onMount(() => {
		const unsubscribe = currentUser.subscribe((user) => {
			if (user) loadReports();
		});

		return () => unsubscribe();
	});
</script>

<AppShell userEmail={$currentUser?.email || 'user@example.com'}>
	<div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h2 class="text-3xl font-bold text-slate-900">Reports</h2>
			<p class="mt-1 text-slate-500">Business performance summary</p>
		</div>

		<button
			type="button"
			onclick={handleExportExcel}
			class="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
		>
			<FileSpreadsheet size={18} />
			Export Excel
		</button>
	</div>

	{#if error}
		<p class="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
	{/if}

	{#if loading}
		<p class="text-slate-500">Loading reports...</p>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
			<div class="rounded-2xl bg-white p-6 shadow-sm">
				<ReceiptText class="text-blue-600" />
				<h3 class="mt-4 text-slate-500">Total Revenue</h3>
				<p class="text-3xl font-bold text-slate-900">{formatCurrency(report.totalRevenue)}</p>
			</div>

			<div class="rounded-2xl bg-white p-6 shadow-sm">
				<Wallet class="text-red-600" />
				<h3 class="mt-4 text-slate-500">Total Expenses</h3>
				<p class="text-3xl font-bold text-slate-900">{formatCurrency(report.totalExpenses)}</p>
			</div>

			<div class="rounded-2xl bg-white p-6 shadow-sm">
				<TrendingUp class="text-green-600" />
				<h3 class="mt-4 text-slate-500">Net Profit</h3>
				<p class="text-3xl font-bold text-slate-900">{formatCurrency(report.netProfit)}</p>
			</div>

			<div class="rounded-2xl bg-white p-6 shadow-sm">
				<Users class="text-purple-600" />
				<h3 class="mt-4 text-slate-500">Customers</h3>
				<p class="text-3xl font-bold text-slate-900">{report.totalCustomers}</p>
			</div>
		</div>

		<div class="mt-6 grid gap-6 md:grid-cols-3">
			<div class="rounded-2xl bg-white p-6 shadow-sm">
				<BarChart3 class="text-blue-600" />
				<p class="mt-2 text-sm text-slate-500">Total Invoices</p>
				<h3 class="text-2xl font-bold text-slate-900">{report.totalInvoices}</h3>
			</div>

			<div class="rounded-2xl bg-white p-6 shadow-sm">
				<AlertCircle class="text-yellow-600" />
				<p class="mt-2 text-sm text-slate-500">Pending Invoices</p>
				<h3 class="text-2xl font-bold text-slate-900">{report.pendingInvoices}</h3>
			</div>

			<div class="rounded-2xl bg-white p-6 shadow-sm">
				<CheckCircle2 class="text-green-600" />
				<p class="mt-2 text-sm text-slate-500">Paid Invoices</p>
				<h3 class="text-2xl font-bold text-slate-900">{report.paidInvoices}</h3>
			</div>
		</div>

		<div class="mt-6 grid gap-6 xl:grid-cols-2">
			<div class="rounded-2xl bg-white p-6 shadow-sm">
				<h3 class="mb-4 text-xl font-bold text-slate-900">Recent Invoices</h3>

				{#if report.recentInvoices.length === 0}
					<p class="text-slate-500">No recent invoices found.</p>
				{:else}
					<div class="overflow-x-auto">
						<table class="w-full text-left">
							<tbody>
								{#each report.recentInvoices as invoice (invoice.id)}
									<tr class="border-b text-sm">
										<td class="py-3 font-semibold">{invoice.invoiceNo}</td>
										<td class="py-3 text-slate-600">{invoice.customerName}</td>
										<td class="py-3 font-semibold">{formatCurrency(invoice.grandTotal)}</td>
										<td class="py-3">
											<span class={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(invoice.status)}`}>
												{invoice.status || 'Pending'}
											</span>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>

			<div class="rounded-2xl bg-white p-6 shadow-sm">
				<h3 class="mb-4 text-xl font-bold text-slate-900">Recent Expenses</h3>

				{#if report.recentExpenses.length === 0}
					<p class="text-slate-500">No recent expenses found.</p>
				{:else}
					<div class="overflow-x-auto">
						<table class="w-full text-left">
							<tbody>
								{#each report.recentExpenses as expense (expense.id)}
									<tr class="border-b text-sm">
										<td class="py-3 font-semibold">{expense.title}</td>
										<td class="py-3 text-slate-600">{expense.category}</td>
										<td class="py-3 font-semibold">{formatCurrency(expense.amount)}</td>
										<td class="py-3 text-slate-600">{expense.expenseDate}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</AppShell>