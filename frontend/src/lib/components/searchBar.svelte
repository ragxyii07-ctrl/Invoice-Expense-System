<script>
	import { Search } from 'lucide-svelte';

	let { value = $bindable(''), placeholder = 'Search...' } = $props();
</script>

<div class="relative w-full">
	<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
		<Search size={18} class="text-slate-400" />
	</div>

	<input
		type="search"
		bind:value
		placeholder={placeholder}
		class="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
	/>
</div>