<script>
	import { LogOut, Sparkles, Building2, Heart } from 'lucide-svelte';

	let { userName = 'User', companyName = 'InvoicePro', logoUrl = '' } = $props();
</script>

<section class="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 px-4">
	<div class="absolute left-10 top-10 h-72 w-72 animate-pulse rounded-full bg-cyan-400/20 blur-3xl"></div>
	<div class="absolute bottom-10 right-10 h-80 w-80 animate-pulse rounded-full bg-pink-400/20 blur-3xl"></div>

	<div class="relative w-full max-w-lg rounded-3xl border border-white/30 bg-white/15 p-10 text-center text-white shadow-2xl backdrop-blur-xl">
		<div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white/40 bg-white/20 shadow-xl">
			{#if logoUrl}
				<img src={logoUrl} alt="Company Logo" class="h-full w-full object-cover" />
			{:else}
				<Building2 size={42} />
			{/if}
		</div>

		<div class="mb-4 flex items-center justify-center gap-2 text-blue-100">
			<Sparkles size={18} />
			<span>Session completed successfully</span>
		</div>

		<h1 class="text-4xl font-extrabold">Thank You, {userName} 👋</h1>
		<p class="mt-4 text-xl font-semibold text-blue-100">{companyName}</p>

		<p class="mt-3 flex items-center justify-center gap-2 text-blue-100">
			Thanks for using Invoice & Expense Management System <Heart size={18} />
		</p>

		<div class="mt-8 flex items-center justify-center gap-2 text-sm text-white/90">
			<LogOut size={18} />
			<span>Logging out securely...</span>
		</div>

		<div class="mx-auto mt-5 h-2 w-64 overflow-hidden rounded-full bg-white/25">
			<div class="h-full w-full animate-pulse rounded-full bg-white"></div>
		</div>
	</div>
</section>