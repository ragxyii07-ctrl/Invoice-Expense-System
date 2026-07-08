<script>
	import { FileText } from 'lucide-svelte';
</script>

<section class="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-950 overflow-hidden">

	<div class="absolute h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl animate-pulse"></div>
	<div class="absolute right-20 bottom-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl animate-pulse"></div>

	<div class="relative flex flex-col items-center">

		<div class="relative flex h-32 w-32 items-center justify-center">

			<div class="absolute h-32 w-32 animate-spin rounded-full border-[6px] border-white/30 border-t-white"></div>

			<div class="absolute h-24 w-24 animate-ping rounded-full bg-white/10"></div>

			<div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-blue-700 shadow-2xl">
				<FileText size={38} />
			</div>

		</div>

		<h1 class="mt-10 text-4xl font-extrabold text-white">
			InvoicePro
		</h1>

		<p class="mt-2 text-lg text-blue-100">
			Invoice & Expense Management System
		</p>

		<div class="mt-8 h-2 w-64 overflow-hidden rounded-full bg-white/20">
			<div class="h-full w-full animate-pulse rounded-full bg-white"></div>
		</div>

	</div>

</section>