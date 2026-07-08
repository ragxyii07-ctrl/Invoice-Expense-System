<script>
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { currentUser } from '$lib/stores/auth.store';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { getActivityLogs } from '$lib/services/activity.service';
	import { History } from 'lucide-svelte';

	let logs = $state([]);
	let loading = $state(true);
	let error = $state('');

	async function loadLogs() {
		const user = get(currentUser);
		if (!user) return;

		try {
			loading = true;
			error = '';
			logs = await getActivityLogs(user.uid);
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function formatDate(value) {
		return value?.toDate?.().toLocaleString() || '-';
	}

	onMount(loadLogs);
</script>

<AppShell userEmail={$currentUser?.email || 'user@example.com'}>
	<div class="mb-8">
		<h2 class="text-3xl font-bold text-slate-900">Activity Logs</h2>
		<p class="mt-1 text-slate-500">View all recent activities performed in your account</p>
	</div>

	{#if error}
		<p class="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
	{/if}

	{#if loading}
		<p class="text-slate-500">Loading activity logs...</p>
	{:else if logs.length === 0}
		<div class="rounded-2xl bg-white p-12 text-center shadow-sm">
			<History class="mx-auto text-slate-400" size={60} />
			<h3 class="mt-4 text-xl font-bold text-slate-900">No Activity Yet</h3>
			<p class="mt-1 text-slate-500">Your activities will appear here.</p>
		</div>
	{:else}
		<div class="overflow-hidden rounded-2xl bg-white shadow-sm">
			<table class="w-full text-left">
				<thead class="bg-slate-100">
					<tr class="text-sm text-slate-600">
						<th class="p-4">Action</th>
						<th class="p-4">Module</th>
						<th class="p-4">Details</th>
						<th class="p-4">Date</th>
					</tr>
				</thead>

				<tbody>
					{#each logs as log (log.id)}
						<tr class="border-b text-sm">
							<td class="p-4 font-semibold text-slate-900">{log.action}</td>
							<td class="p-4 text-slate-600">{log.module}</td>
							<td class="p-4 text-slate-600">{log.details || '-'}</td>
							<td class="p-4 text-slate-600">{formatDate(log.createdAt)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</AppShell>