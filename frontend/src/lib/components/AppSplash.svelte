<script>
	import { FileText } from 'lucide-svelte';
</script>

<section class="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-900 px-4">
	<div class="absolute h-80 w-80 animate-pulse rounded-full bg-cyan-400/20 blur-3xl"></div>
	<div class="absolute bottom-10 right-10 h-72 w-72 animate-pulse rounded-full bg-pink-400/20 blur-3xl"></div>

	<div class="text-center text-white">
		<div class="relative mx-auto flex h-32 w-32 items-center justify-center">
			<div class="absolute h-32 w-32 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>
			<div class="absolute h-24 w-24 animate-ping rounded-full bg-white/10"></div>

			<div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-blue-700 shadow-2xl">
				<FileText size={38} />
			</div>
		</div>

		<h1 class="mt-8 text-4xl font-extrabold">InvoicePro</h1>
		<p class="mt-2 text-blue-100">Invoice & Expense Management System</p>

		<div class="mx-auto mt-8 h-2 w-64 overflow-hidden rounded-full bg-white/25">
			<div class="h-full w-full animate-pulse rounded-full bg-white"></div>
		</div>

		<p class="mt-4 text-sm text-blue-100">Loading your workspace...</p>
	</div>
</section>