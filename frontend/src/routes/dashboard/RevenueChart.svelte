<script>
	import { onMount } from 'svelte';
	import {
		Chart,
		CategoryScale,
		LinearScale,
		BarElement,
		Title,
		Tooltip,
		Legend
	} from 'chart.js';

	Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

	let {
		revenue = [5000, 7000, 9000, 12000, 15000, 18000],
		expenses = [3000, 4000, 4500, 6000, 7500, 9000]
	} = $props();

	let canvas;

	onMount(() => {
		const chart = new Chart(canvas, {
			type: 'bar',
			data: {
				labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
				datasets: [
					{
						label: 'Revenue',
						data: revenue,
						backgroundColor: '#2563eb'
					},
					{
						label: 'Expenses',
						data: expenses,
						backgroundColor: '#ef4444'
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { position: 'top' },
					title: { display: false }
				}
			}
		});

		return () => chart.destroy();
	});
</script>

<div class="mt-8 rounded-2xl bg-white p-6 shadow-sm">
	<h2 class="mb-4 text-xl font-bold text-slate-900">Revenue vs Expense</h2>
	<canvas bind:this={canvas}></canvas>
</div>