<script>
	import { onMount } from 'svelte';
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { currentUser } from '$lib/stores/auth.store';
	import { getMonthlyAnalytics } from '$lib/services/analytics.service';

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	let monthlyRevenue = $state(Array(12).fill(0));
	let monthlyExpenses = $state(Array(12).fill(0));
	let loading = $state(true);
	let error = $state('');

	let totalRevenue = $derived(monthlyRevenue.reduce((a, b) => a + Number(b || 0), 0));
	let totalExpenses = $derived(monthlyExpenses.reduce((a, b) => a + Number(b || 0), 0));
	let netProfit = $derived(totalRevenue - totalExpenses);
	let maxValue = $derived(Math.max(...monthlyRevenue, ...monthlyExpenses, 1));

	function formatCurrency(value) {
		return `₹${Number(value || 0).toLocaleString('en-IN')}`;
	}

	function barHeight(value) {
		return Math.max((Number(value || 0) / maxValue) * 180, 10);
	}

	onMount(async () => {
		try {
			loading = true;
			error = '';

			const data = await getMonthlyAnalytics();

			monthlyRevenue = data?.revenue || Array(12).fill(0);
			monthlyExpenses = data?.expenses || Array(12).fill(0);
		} catch (err) {
			error = err.message || 'Failed to load analytics';
		} finally {
			loading = false;
		}
	});
</script>

<AppShell userEmail={$currentUser?.email || 'user@example.com'}>
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
					<h2 class="mt-2 text-3xl font-bold text-blue-600">{formatCurrency(totalRevenue)}</h2>
				</div>

				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<p class="text-sm text-slate-500">Total Expenses</p>
					<h2 class="mt-2 text-3xl font-bold text-red-500">{formatCurrency(totalExpenses)}</h2>
				</div>

				<div class="rounded-2xl bg-white p-6 shadow-sm">
					<p class="text-sm text-slate-500">Net Profit</p>
					<h2 class="mt-2 text-3xl font-bold text-green-600">{formatCurrency(netProfit)}</h2>
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
					<div class="flex min-w-175 items-end gap-8 border-b border-slate-200 pb-4">
						{#each months as month, i}
							<div class="flex flex-col items-center gap-3">
								<div class="flex h-52 items-end gap-2">
									<div
										class="w-6 rounded-t-xl bg-blue-600"
										style={`height: ${barHeight(monthlyRevenue[i])}px`}
										title={`Revenue ${formatCurrency(monthlyRevenue[i])}`}
									></div>

									<div
										class="w-6 rounded-t-xl bg-red-500"
										style={`height: ${barHeight(monthlyExpenses[i])}px`}
										title={`Expense ${formatCurrency(monthlyExpenses[i])}`}
									></div>
								</div>

								<p class="text-xs font-semibold text-slate-500">{month}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
</AppShell>