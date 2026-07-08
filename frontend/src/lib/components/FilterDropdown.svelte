<script>
	let { value = $bindable(), options = [] } = $props();
</script>

<select
	bind:value
	class="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
>
	<option value="">All</option>

	{#each options as option (option)}
		<option value={option}>
			{option}
		</option>
	{/each}
</select>