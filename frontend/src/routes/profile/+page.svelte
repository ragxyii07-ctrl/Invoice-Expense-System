<script>
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { currentUser, currentUserData, currentUserRole } from '$lib/stores/auth.store';
	import { User, Mail, ShieldCheck, CalendarDays, BadgeCheck, IdCard } from 'lucide-svelte';

	function formatDate(value) {
		if (!value) return '-';
		return new Date(value).toLocaleString('en-IN');
	}
</script>

<AppShell userEmail={$currentUser?.email || 'user@example.com'}>
	<div class="mb-8">
		<h2 class="text-3xl font-bold text-slate-900">Profile</h2>
		<p class="mt-1 text-slate-500">View your account and role details</p>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<div class="rounded-2xl bg-white p-6 text-center shadow-sm">
			<div class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
				{($currentUserData?.fullName || $currentUser?.email || 'U').charAt(0).toUpperCase()}
			</div>

			<h3 class="mt-4 text-2xl font-bold text-slate-900">
				{$currentUserData?.fullName || 'Invoice User'}
			</h3>

			<p class="mt-1 text-slate-500">
				{$currentUser?.email}
			</p>

			<span class="mt-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold capitalize text-blue-700">
				{$currentUserRole || $currentUserData?.role || 'owner'}
			</span>
		</div>

		<div class="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
			<h3 class="mb-6 text-xl font-bold text-slate-900">Account Information</h3>

			<div class="grid gap-4 md:grid-cols-2">
				<div class="rounded-xl border p-4">
					<div class="mb-2 flex items-center gap-2 text-slate-500">
						<User size={18} />
						<span>Full Name</span>
					</div>
					<p class="font-semibold text-slate-900">{$currentUserData?.fullName || '-'}</p>
				</div>

				<div class="rounded-xl border p-4">
					<div class="mb-2 flex items-center gap-2 text-slate-500">
						<Mail size={18} />
						<span>Email</span>
					</div>
					<p class="font-semibold text-slate-900">{$currentUser?.email || '-'}</p>
				</div>

				<div class="rounded-xl border p-4">
					<div class="mb-2 flex items-center gap-2 text-slate-500">
						<ShieldCheck size={18} />
						<span>Role</span>
					</div>
					<p class="font-semibold capitalize text-slate-900">
						{$currentUserRole || $currentUserData?.role || 'owner'}
					</p>
				</div>

				<div class="rounded-xl border p-4">
					<div class="mb-2 flex items-center gap-2 text-slate-500">
						<BadgeCheck size={18} />
						<span>Status</span>
					</div>
					<p class="font-semibold capitalize text-green-600">
						{$currentUserData?.status || 'active'}
					</p>
				</div>

				<div class="rounded-xl border p-4 md:col-span-2">
					<div class="mb-2 flex items-center gap-2 text-slate-500">
						<IdCard size={18} />
						<span>User ID</span>
					</div>
					<p class="break-all font-semibold text-slate-900">{$currentUser?.uid || '-'}</p>
				</div>

				<div class="rounded-xl border p-4">
					<div class="mb-2 flex items-center gap-2 text-slate-500">
						<CalendarDays size={18} />
						<span>Created At</span>
					</div>
					<p class="font-semibold text-slate-900">
						{formatDate($currentUser?.metadata?.creationTime)}
					</p>
				</div>

				<div class="rounded-xl border p-4">
					<div class="mb-2 flex items-center gap-2 text-slate-500">
						<CalendarDays size={18} />
						<span>Last Login</span>
					</div>
					<p class="font-semibold text-slate-900">
						{formatDate($currentUser?.metadata?.lastSignInTime)}
					</p>
				</div>
			</div>
		</div>
	</div>
</AppShell>