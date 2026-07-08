<script>
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { currentUser, authLoading } from '$lib/stores/auth.store';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import MonthlyChart from './MonthlyChart.svelte';
	import { getDashboardData } from '$lib/services/dashboard.service';
	import { getMonthlyAnalytics } from '$lib/services/analytics.service';

	import {
		ReceiptText,
		Wallet,
		Users,
		BarChart3,
		TrendingUp,
		UserCheck,
		UserX,
		BriefcaseBusiness,
		CheckCircle2,
		Clock
	} from 'lucide-svelte';

	let loading = $state(false);
	let error = $state('');

	let monthlyRevenue = $state(Array(12).fill(0));
	let monthlyExpenses = $state(Array(12).fill(0));

	let report = $state({
		totalCustomers: 0,
		activeCustomers: 0,
		inactiveCustomers: 0,
		secretaryCount: 0,
		totalInvoices: 0,
		totalRevenue: 0,
		totalExpenses: 0,
		netProfit: 0,
		pendingInvoices: 0,
		paidInvoices: 0,
		overdueInvoices: 0,
		recentInvoices: [],
		recentExpenses: []
	});

	$effect(() => {
		if (!$authLoading && !$currentUser) {
			goto('/login');
		}
	});

	async function loadDashboard() {
		try {
			loading = true;
			error = '';

			const data = await getDashboardData();
			const dashboard = data.report || data;

			const analytics = await getMonthlyAnalytics();
			monthlyRevenue = analytics.revenue || Array(12).fill(0);
			monthlyExpenses = analytics.expenses || Array(12).fill(0);

			report = {
				...report,
				totalCustomers: dashboard.totalCustomers || 0,
				activeCustomers: dashboard.activeCustomers || 0,
				inactiveCustomers: dashboard.inactiveCustomers || 0,
				secretaryCount: dashboard.secretaryCount || 0,
				totalInvoices: dashboard.totalInvoices || 0,
				totalRevenue: dashboard.totalRevenue || 0,
				totalExpenses: dashboard.totalExpenses || 0,
				netProfit: dashboard.netProfit || 0,
				pendingInvoices: dashboard.pendingInvoices || 0,
				paidInvoices: dashboard.paidInvoices || 0,
				overdueInvoices: dashboard.overdueInvoices || 0,
				recentInvoices: dashboard.recentInvoices || [],
				recentExpenses: dashboard.recentExpenses || []
			};
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function formatCurrency(value) {
		return `₹${Number(value || 0).toLocaleString('en-IN')}`;
	}

	onMount(() => {
		const unsubscribe = currentUser.subscribe((user) => {
			if (user) loadDashboard();
		});

		return () => unsubscribe();
	});
</script>

{#if !$authLoading && $currentUser}
	<AppShell userEmail={$currentUser?.email || 'user@example.com'}>
		<div class="mb-8">
			<h2 class="text-3xl font-bold text-slate-900">Dashboard</h2>
			<p class="mt-1 text-slate-500">Overview of your business performance</p>
		</div>

		{#if error}
			<p class="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
		{/if}

		{#if loading}
			<p class="text-slate-500">Loading dashboard...</p>
		{:else}
			<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<ReceiptText class="text-blue-600" />
					<h3 class="mt-4 text-slate-500">Total Invoices</h3>
					<p class="text-3xl font-bold text-slate-900">{report.totalInvoices}</p>
					<p class="mt-1 text-sm text-slate-500">Revenue: {formatCurrency(report.totalRevenue)}</p>
				</div>

				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<Wallet class="text-red-600" />
					<h3 class="mt-4 text-slate-500">Total Expenses</h3>
					<p class="text-3xl font-bold text-slate-900">{formatCurrency(report.totalExpenses)}</p>
					<p class="mt-1 text-sm text-slate-500">Business spending</p>
				</div>

				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<TrendingUp class="text-green-600" />
					<h3 class="mt-4 text-slate-500">Net Profit</h3>
					<p class={report.netProfit >= 0 ? 'text-3xl font-bold text-green-600' : 'text-3xl font-bold text-red-600'}>
						{formatCurrency(report.netProfit)}
					</p>
					<p class="mt-1 text-sm text-slate-500">Revenue - Expenses</p>
				</div>

				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<Users class="text-purple-600" />
					<h3 class="mt-4 text-slate-500">Total Customers</h3>
					<p class="text-3xl font-bold text-slate-900">{report.totalCustomers}</p>
					<p class="mt-1 text-sm text-slate-500">All customers</p>
				</div>
			</div>

			<div class="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<UserCheck class="text-green-600" />
					<p class="mt-2 text-sm text-slate-500">Active Customers</p>
					<h3 class="text-2xl font-bold text-slate-900">{report.activeCustomers}</h3>
				</div>

				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<UserX class="text-red-600" />
					<p class="mt-2 text-sm text-slate-500">Inactive Customers</p>
					<h3 class="text-2xl font-bold text-slate-900">{report.inactiveCustomers}</h3>
				</div>

				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<BriefcaseBusiness class="text-indigo-600" />
					<p class="mt-2 text-sm text-slate-500">Secretaries</p>
					<h3 class="text-2xl font-bold text-slate-900">{report.secretaryCount}</h3>
				</div>

				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<Clock class="text-yellow-600" />
					<p class="mt-2 text-sm text-slate-500">Pending</p>
					<h3 class="text-2xl font-bold text-slate-900">{report.pendingInvoices}</h3>
				</div>

				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<CheckCircle2 class="text-green-600" />
					<p class="mt-2 text-sm text-slate-500">Paid</p>
					<h3 class="text-2xl font-bold text-slate-900">{report.paidInvoices}</h3>
				</div>
			</div>

			<div class="mt-8">
				<MonthlyChart revenue={monthlyRevenue} expenses={monthlyExpenses} />
			</div>

			<div class="mt-8 grid gap-6 xl:grid-cols-2">
				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<div class="mb-4 flex items-center gap-2">
						<ReceiptText class="text-blue-600" />
						<h3 class="text-xl font-bold text-slate-900">Recent Invoices</h3>
					</div>

					{#if report.recentInvoices.length === 0}
						<p class="text-slate-500">No invoices created yet.</p>
					{:else}
						<div class="overflow-x-auto">
							<table class="w-full text-left">
								<thead>
									<tr class="border-b text-sm text-slate-500">
										<th class="py-3">Invoice</th>
										<th class="py-3">Customer</th>
										<th class="py-3">Amount</th>
									</tr>
								</thead>
								<tbody>
									{#each report.recentInvoices as invoice (invoice.id)}
										<tr class="border-b text-sm">
											<td class="py-3 font-semibold">{invoice.invoiceNo}</td>
											<td class="py-3 text-slate-600">{invoice.customerName}</td>
											<td class="py-3 font-semibold">{formatCurrency(invoice.grandTotal)}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</div>

				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<div class="mb-4 flex items-center gap-2">
						<BarChart3 class="text-red-600" />
						<h3 class="text-xl font-bold text-slate-900">Recent Expenses</h3>
					</div>

					{#if report.recentExpenses.length === 0}
						<p class="text-slate-500">No expenses added yet.</p>
					{:else}
						<div class="overflow-x-auto">
							<table class="w-full text-left">
								<thead>
									<tr class="border-b text-sm text-slate-500">
										<th class="py-3">Title</th>
										<th class="py-3">Category</th>
										<th class="py-3">Amount</th>
									</tr>
								</thead>
								<tbody>
									{#each report.recentExpenses as expense (expense.id)}
										<tr class="border-b text-sm">
											<td class="py-3 font-semibold">{expense.title}</td>
											<td class="py-3 text-slate-600">{expense.category}</td>
											<td class="py-3 font-semibold">{formatCurrency(expense.amount)}</td>
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
{/if}