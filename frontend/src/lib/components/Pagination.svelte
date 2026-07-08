<script>
	let { currentPage = $bindable(), totalPages = 1 } = $props();
</script>

<div class="mt-6 flex justify-center gap-3">
	<button
		class="rounded-lg bg-slate-200 px-4 py-2"
		disabled={currentPage === 1}
		onclick={() => currentPage--}
	>
		Previous
	</button>

	<span class="px-4 py-2 font-semibold">
		{currentPage} / {totalPages}
	</span>

	<button
		class="rounded-lg bg-blue-600 px-4 py-2 text-white"
		disabled={currentPage === totalPages}
		onclick={() => currentPage++}
	>
		Next
	</button>
</div>