<script>
	import { onMount } from 'svelte';
	import {
		Chart,
		ArcElement,
		Tooltip,
		Legend
	} from 'chart.js';

	Chart.register(
		ArcElement,
		Tooltip,
		Legend
	);

	let canvas;

	let {
		labels = ['Office', 'Travel', 'Food', 'Internet', 'Other'],
		data = [12000, 7000, 3500, 2500, 1500]
	} = $props();

	onMount(() => {
		const chart = new Chart(canvas, {
			type: 'pie',
			data: {
				labels,
				datasets: [
					{
						data,
						backgroundColor: [
							'#2563eb',
							'#10b981',
							'#f59e0b',
							'#ef4444',
							'#8b5cf6'
						]
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'bottom'
					}
				}
			}
		});

		return () => chart.destroy();
	});
</script>

<div class="rounded-2xl bg-white p-6 shadow-sm">
	<h2 class="mb-4 text-xl font-bold">
		Expense Categories
	</h2>

	<canvas bind:this={canvas}></canvas>
</div>