<script>
	import {
		LayoutDashboard,
		Users,
		ReceiptText,
		Wallet,
		BarChart3,
		Settings,
		DatabaseBackup,
		X,
		FileText
	} from 'lucide-svelte';

	import { page } from '$app/stores';
	import { currentUserRole } from '$lib/stores/auth.store';

	let { open = $bindable(false) } = $props();

	const menuItems = [
		{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['owner', 'secretary'] },
		{ name: 'Customers', href: '/customers', icon: Users, roles: ['owner', 'secretary'] },
		{ name: 'Invoices', href: '/invoices', icon: ReceiptText, roles: ['owner', 'secretary'] },
		{ name: 'Expenses', href: '/expenses', icon: Wallet, roles: ['owner', 'secretary'] },
		{ name: 'Reports', href: '/reports', icon: BarChart3, roles: ['owner'] },
		{ name: 'Settings', href: '/settings', icon: Settings, roles: ['owner'] },
		{ name: 'Backup', href: '/backup', icon: DatabaseBackup, roles: ['owner'] }
	];

	let visibleMenuItems = $derived(
		menuItems.filter((item) => item.roles.includes($currentUserRole || 'owner'))
	);
</script>

<aside
	class={`fixed inset-y-0 left-0 z-50 w-72 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
		open ? 'translate-x-0' : '-translate-x-full'
	}`}
>
	<div class="flex h-20 items-center justify-between border-b border-slate-800/70 px-6">
		<div class="flex items-center gap-3">
			<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
				<FileText size={22} />
			</div>

			<div>
				<h1 class="text-2xl font-bold tracking-wide">InvoicePro</h1>
				<p class="text-xs text-slate-400">
					{$currentUserRole === 'secretary' ? 'Secretary Panel' : 'Business Suite'}
				</p>
			</div>
		</div>

		<button
			type="button"
			class="rounded-lg p-2 hover:bg-slate-800 lg:hidden"
			onclick={() => (open = false)}
		>
			<X size={22} />
		</button>
	</div>

	<nav class="mt-6 space-y-2 px-4">
		{#each visibleMenuItems as item (item.href)}
			<a
				href={item.href}
				class={`group flex items-center gap-4 rounded-2xl px-4 py-3 font-medium transition-all duration-300 ease-in-out ${
					$page.url.pathname === item.href
						? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl'
						: 'text-slate-300 hover:translate-x-1 hover:bg-slate-800/70 hover:text-white'
				}`}
			>
				<svelte:component this={item.icon} size={21} />
				<span>{item.name}</span>
			</a>
		{/each}
	</nav>
</aside>