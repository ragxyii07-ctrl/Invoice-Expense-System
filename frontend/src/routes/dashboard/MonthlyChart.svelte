<script>
	import { BarChart3 } from 'lucide-svelte';

	let { revenue = [], expenses = [] } = $props();

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	let monthlyRevenue = $derived(months.map((_, i) => Number(revenue[i] || 0)));
	let monthlyExpenses = $derived(months.map((_, i) => Number(expenses[i] || 0)));

	let maxValue = $derived(Math.max(...monthlyRevenue, ...monthlyExpenses, 1));
	let totalRevenue = $derived(monthlyRevenue.reduce((a, b) => a + b, 0));
	let totalExpenses = $derived(monthlyExpenses.reduce((a, b) => a + b, 0));
	let netProfit = $derived(totalRevenue - totalExpenses);

	function getHeight(value) {
		const height = (Number(value || 0) / maxValue) * 180;
		return Math.max(height, 4) + 'px';
	}

	function money(value) {
		return `₹${Number(value || 0).toLocaleString('en-IN')}`;
	}
</script>

<div class="rounded-2xl bg-white p-6 shadow-sm">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h3 class="text-xl font-bold text-slate-900">Revenue vs Expense</h3>
			<p class="mt-1 text-sm text-slate-500">Monthly analytics overview</p>
		</div>

		<div class="rounded-xl bg-blue-100 p-3 text-blue-600">
			<BarChart3 size={24} />
		</div>
	</div>

	<div class="mb-6 flex gap-5 text-sm">
		<div class="flex items-center gap-2">
			<span class="h-3 w-3 rounded-full bg-blue-600"></span>
			<span class="text-slate-600">Revenue</span>
		</div>

		<div class="flex items-center gap-2">
			<span class="h-3 w-3 rounded-full bg-red-500"></span>
			<span class="text-slate-600">Expense</span>
		</div>
	</div>

	<div class="overflow-x-auto">
		<div class="flex min-w-[850px] items-end gap-5 border-b border-slate-200 pb-4">
			{#each months as month, i (month)}
				<div class="flex flex-1 flex-col items-center">
					<div class="flex h-48 items-end gap-2">
						<div
							class="w-5 rounded-t-xl bg-blue-600"
							style:height={getHeight(monthlyRevenue[i])}
							title={money(monthlyRevenue[i])}
						></div>

						<div
							class="w-5 rounded-t-xl bg-red-500"
							style:height={getHeight(monthlyExpenses[i])}
							title={money(monthlyExpenses[i])}
						></div>
					</div>

					<p class="mt-3 text-xs font-semibold text-slate-500">{month}</p>
				</div>
			{/each}
		</div>
	</div>

	<div class="mt-6 grid gap-4 md:grid-cols-3">
		<div class="rounded-xl bg-blue-50 p-4">
			<p class="text-sm text-blue-600">Total Revenue</p>
			<h4 class="text-xl font-bold text-blue-700">{money(totalRevenue)}</h4>
		</div>

		<div class="rounded-xl bg-red-50 p-4">
			<p class="text-sm text-red-600">Total Expense</p>
			<h4 class="text-xl font-bold text-red-700">{money(totalExpenses)}</h4>
		</div>

		<div class="rounded-xl bg-green-50 p-4">
			<p class="text-sm text-green-600">Net Profit</p>
			<h4 class="text-xl font-bold text-green-700">{money(netProfit)}</h4>
		</div>
	</div>
</div>