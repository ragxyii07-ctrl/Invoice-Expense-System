<script>
	import { onMount } from 'svelte';
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { getMonthlyAnalytics } from '$lib/services/analytics.service';

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	let monthlyRevenue = Array(12).fill(0);
	let monthlyExpenses = Array(12).fill(0);
	let loading = true;
	let error = null;

	onMount(async () => {
		try {
			const data = await getMonthlyAnalytics();
			monthlyRevenue = data.revenue;
			monthlyExpenses = data.expenses;
		} catch (err) {
			error = err.message;
			console.error('Failed to load analytics:', err);
		} finally {
			loading = false;
		}
	});

	$: totalRevenue = monthlyRevenue.reduce((a, b) => a + b, 0);
	$: totalExpenses = monthlyExpenses.reduce((a, b) => a + b, 0);
	$: netProfit = totalRevenue - totalExpenses;
	$: maxValue = Math.max(...monthlyRevenue, ...monthlyExpenses) || 1;

	function barHeight(value) {
		return Math.max((value / maxValue) * 180, 10);
	}
</script>

<AppShell>
	<div class="space-y-8">
		<div>
			<h1 class="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
			<p class="mt-1 text-sm text-slate-500">Revenue, expenses and profit overview</p>
		</div>

		{#if error}
			<div class="rounded-2xl bg-red-50 p-6 shadow-sm">
				<p class="text-red-700">Error loading analytics: {error}</p>
			</div>
		{:else if loading}
			<div class="rounded-2xl bg-white p-6 shadow-sm">
				<p class="text-slate-500">Loading analytics data...</p>
			</div>
		{:else}
			<div class="grid gap-6 md:grid-cols-3">
			<div class="rounded-2xl bg-white p-6 shadow-sm">
				<p class="text-sm text-slate-500">Total Revenue</p>
				<h2 class="mt-2 text-3xl font-bold text-blue-600">₹{totalRevenue}</h2>
			</div>

			<div class="rounded-2xl bg-white p-6 shadow-sm">
				<p class="text-sm text-slate-500">Total Expenses</p>
				<h2 class="mt-2 text-3xl font-bold text-red-500">₹{totalExpenses}</h2>
			</div>

			<div class="rounded-2xl bg-white p-6 shadow-sm">
				<p class="text-sm text-slate-500">Net Profit</p>
				<h2 class="mt-2 text-3xl font-bold text-green-600">₹{netProfit}</h2>
			</div>
		</div>

		<div class="rounded-2xl bg-white p-6 shadow-sm">
			<div class="mb-6 flex items-center justify-between">
				<div>
					<h2 class="text-xl font-bold text-slate-900">Revenue vs Expense</h2>
					<p class="text-sm text-slate-500">Monthly comparison chart</p>
				</div>

				<div class="flex gap-4 text-sm">
					<div class="flex items-center gap-2">
						<span class="h-3 w-3 rounded-full bg-blue-600"></span>
						Revenue
					</div>
					<div class="flex items-center gap-2">
						<span class="h-3 w-3 rounded-full bg-red-500"></span>
						Expense
					</div>
				</div>
			</div>

			<div class="overflow-x-auto">
				<div class="flex min-w-[700px] items-end gap-8 border-b border-slate-200 pb-4">
					{#each months as month, i}
						<div class="flex flex-col items-center gap-3">
							<div class="flex h-52 items-end gap-2">
								<div
									class="w-6 rounded-t-xl bg-blue-600"
									style={`height: ${barHeight(monthlyRevenue[i])}px`}
									title={`Revenue ₹${monthlyRevenue[i]}`}
								></div>

								<div
									class="w-6 rounded-t-xl bg-red-500"
									style={`height: ${barHeight(monthlyExpenses[i])}px`}
									title={`Expense ₹${monthlyExpenses[i]}`}
								></div>
							</div>

							<p class="text-xs font-semibold text-slate-500">{month}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</AppShell>