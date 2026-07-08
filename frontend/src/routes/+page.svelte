<script>
	import { ReceiptText, ArrowRight } from 'lucide-svelte';
</script>

<section class="min-h-screen bg-slate-100 flex items-center justify-center px-6">
	<div class="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
		<div>
			<div class="flex items-center gap-3 mb-6">
				<div class="bg-blue-600 text-white p-3 rounded-2xl">
					<ReceiptText size={32} />
				</div>
				<h1 class="text-3xl font-bold text-slate-900">Invoice Expense System</h1>
			</div>

			<h2 class="text-5xl font-extrabold text-slate-900 leading-tight">
				Manage invoices and expenses easily
			</h2>

			<p class="mt-5 text-slate-600 text-lg">
				A modern business solution for small businesses to track invoices, customers,
				expenses and reports.
			</p>

			<div class="mt-8 flex gap-4">
				<a
					href="/register"
					class="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700"
				>
					Get Started <ArrowRight size={18} />
				</a>

				<a
					href="/login"
					class="bg-white text-slate-800 px-6 py-3 rounded-xl font-semibold border hover:bg-slate-50"
				>
					Login
				</a>
			</div>
		</div>

		<div class="bg-white rounded-3xl shadow-xl p-8">
			<h3 class="text-2xl font-bold text-slate-900 mb-6">Project Modules</h3>

			<div class="space-y-4">
				<div class="p-4 bg-blue-50 rounded-xl">📄 Invoice Management</div>
				<div class="p-4 bg-green-50 rounded-xl">💰 Expense Tracking</div>
				<div class="p-4 bg-purple-50 rounded-xl">👥 Customer Management</div>
				<div class="p-4 bg-orange-50 rounded-xl">📊 Reports & Analytics</div>
			</div>
		</div>
	</div>
</section>