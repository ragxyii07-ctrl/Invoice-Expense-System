<script>
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { currentUser } from '$lib/stores/auth.store';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	import { exportBackup, importBackup, downloadBackupFile } from '$lib/services/backup.service';
	import { getBusinessSettings, saveBusinessSettings } from '$lib/services/settings.service';

	import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
	import { auth } from '$lib/firebase/firebase';

	import {
		Download,
		Upload,
		DatabaseBackup,
		LockKeyhole,
		ShieldCheck,
		Eye,
		EyeOff,
		KeyRound
	} from 'lucide-svelte';

	let loading = $state(false);
	let error = $state('');
	let success = $state('');

	let unlocked = $state(false);
	let savedPassword = $state('');
	let passwordSet = $state(false);

	let backupPassword = $state('');
	let showBackupPassword = $state(false);

	let newBackupPassword = $state('');
	let confirmBackupPassword = $state('');
	let showNewPassword = $state(false);
	let showConfirmPassword = $state(false);

	let forgotMode = $state(false);
	let loginPassword = $state('');
	let newForgotPassword = $state('');
	let confirmForgotPassword = $state('');
	let showLoginPassword = $state(false);
	let showForgotNewPassword = $state(false);
	let showForgotConfirmPassword = $state(false);

	async function loadBackupPassword() {
		const user = get(currentUser);
		if (!user) return;

		try {
			const settings = await getBusinessSettings(user.uid);
			savedPassword = settings?.backupPassword || '';
			passwordSet = !!savedPassword;
		} catch {
			passwordSet = false;
		}
	}

	async function saveBackupPassword() {
		error = '';
		success = '';

		const user = get(currentUser);

		if (!user) {
			error = 'Please login again';
			return;
		}

		if (!newBackupPassword || !confirmBackupPassword) {
			error = 'Enter password and confirm password';
			return;
		}

		if (newBackupPassword.length < 6) {
			error = 'Password must be at least 6 characters';
			return;
		}

		if (newBackupPassword !== confirmBackupPassword) {
			error = 'Password does not match';
			return;
		}

		try {
			loading = true;

			await saveBusinessSettings(user.uid, {
				backupPassword: newBackupPassword
			});

			savedPassword = newBackupPassword;
			passwordSet = true;
			unlocked = true;

			newBackupPassword = '';
			confirmBackupPassword = '';

			success = 'Backup password set successfully';
		} catch (err) {
			error = err.message || 'Failed to set backup password';
		} finally {
			loading = false;
		}
	}

	function verifyBackupPassword() {
		error = '';
		success = '';

		if (!backupPassword) {
			error = 'Enter backup password';
			return;
		}

		if (backupPassword !== savedPassword) {
			error = 'Wrong backup password';
			return;
		}

		unlocked = true;
		backupPassword = '';
	}

	async function resetBackupPassword() {
		error = '';
		success = '';

		const user = auth.currentUser;

		if (!user?.email) {
			error = 'Please login again';
			return;
		}

		if (!loginPassword || !newForgotPassword || !confirmForgotPassword) {
			error = 'All fields are required';
			return;
		}

		if (newForgotPassword.length < 6) {
			error = 'New backup password must be at least 6 characters';
			return;
		}

		if (newForgotPassword !== confirmForgotPassword) {
			error = 'New password and confirm password do not match';
			return;
		}

		try {
			loading = true;

			const credential = EmailAuthProvider.credential(user.email, loginPassword);
			await reauthenticateWithCredential(user, credential);

			await saveBusinessSettings(user.uid, {
				backupPassword: newForgotPassword
			});

			savedPassword = newForgotPassword;
			passwordSet = true;
			unlocked = true;
			forgotMode = false;

			loginPassword = '';
			newForgotPassword = '';
			confirmForgotPassword = '';

			success = 'Backup password reset successfully';
		} catch {
			error = 'Login password is incorrect';
		} finally {
			loading = false;
		}
	}

	async function handleExport() {
		error = '';
		success = '';

		try {
			loading = true;
			const data = await exportBackup();
			downloadBackupFile(data);
			success = 'Backup exported successfully';
		} catch (err) {
			error = err.message || 'Failed to export backup';
		} finally {
			loading = false;
		}
	}

	async function handleImport(event) {
		error = '';
		success = '';

		const file = event.target.files?.[0];
		if (!file) return;

		try {
			loading = true;
			const text = await file.text();
			const backup = JSON.parse(text);
			await importBackup(backup);
			success = 'Backup restored successfully';
			event.target.value = '';
		} catch (err) {
			error = err.message || 'Invalid backup file';
		} finally {
			loading = false;
		}
	}

	onMount(loadBackupPassword);
</script>

<AppShell userEmail={$currentUser?.email || 'user@example.com'}>
	{#if !passwordSet}
		<div class="flex min-h-[70vh] items-center justify-center">
			<div class="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
				<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
					<LockKeyhole size={32} />
				</div>

				<h2 class="mt-5 text-2xl font-bold text-slate-900">Set Backup Password</h2>
				<p class="mt-2 text-slate-500">First time backup access-ku password set pannunga</p>

				{#if error}
					<p class="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
				{/if}

				<form
					class="mt-6 space-y-4"
					onsubmit={(e) => {
						e.preventDefault();
						saveBackupPassword();
					}}
				>
					<div class="relative">
						<input
							type={showNewPassword ? 'text' : 'password'}
							bind:value={newBackupPassword}
							placeholder="New Backup Password"
							class="w-full rounded-xl border px-4 py-3 pr-12 text-center outline-none focus:ring-2 focus:ring-green-500"
						/>

						<button
							type="button"
							class="absolute right-3 top-3 text-slate-500"
							onclick={() => (showNewPassword = !showNewPassword)}
						>
							{#if showNewPassword}
								<EyeOff size={20} />
							{:else}
								<Eye size={20} />
							{/if}
						</button>
					</div>

					<div class="relative">
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							bind:value={confirmBackupPassword}
							placeholder="Confirm Backup Password"
							class="w-full rounded-xl border px-4 py-3 pr-12 text-center outline-none focus:ring-2 focus:ring-green-500"
						/>

						<button
							type="button"
							class="absolute right-3 top-3 text-slate-500"
							onclick={() => (showConfirmPassword = !showConfirmPassword)}
						>
							{#if showConfirmPassword}
								<EyeOff size={20} />
							{:else}
								<Eye size={20} />
							{/if}
						</button>
					</div>

					<button
						type="submit"
						disabled={loading}
						class="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
					>
						<ShieldCheck size={18} />
						{loading ? 'Saving...' : 'Set Password'}
					</button>
				</form>
			</div>
		</div>
	{:else if !unlocked}
		<div class="flex min-h-[70vh] items-center justify-center">
			<div class="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
				<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
					<LockKeyhole size={32} />
				</div>

				<h2 class="mt-5 text-2xl font-bold text-slate-900">Backup Security</h2>
				<p class="mt-2 text-slate-500">Enter backup password to access backup & restore</p>

				{#if error}
					<p class="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
				{/if}

				{#if success}
					<p class="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">{success}</p>
				{/if}

				{#if !forgotMode}
					<form
						class="mt-6 space-y-4"
						onsubmit={(e) => {
							e.preventDefault();
							verifyBackupPassword();
						}}
					>
						<div class="relative">
							<input
								type={showBackupPassword ? 'text' : 'password'}
								bind:value={backupPassword}
								placeholder="Enter Backup Password"
								class="w-full rounded-xl border px-4 py-3 pr-12 text-center outline-none focus:ring-2 focus:ring-blue-500"
							/>

							<button
								type="button"
								class="absolute right-3 top-3 text-slate-500 hover:text-blue-600"
								onclick={() => (showBackupPassword = !showBackupPassword)}
							>
								{#if showBackupPassword}
									<EyeOff size={20} />
								{:else}
									<Eye size={20} />
								{/if}
							</button>
						</div>

						<button
							type="submit"
							class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
						>
							<ShieldCheck size={18} />
							Unlock Backup
						</button>

						<button
							type="button"
							class="text-sm font-semibold text-blue-600 hover:underline"
							onclick={() => {
								error = '';
								success = '';
								forgotMode = true;
							}}
						>
							Forgot Backup Password?
						</button>
					</form>
				{:else}
					<form
						class="mt-6 space-y-4"
						onsubmit={(e) => {
							e.preventDefault();
							resetBackupPassword();
						}}
					>
						<div class="rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
							Enter your current login password to reset backup password.
						</div>

						<div class="relative">
							<input
								type={showLoginPassword ? 'text' : 'password'}
								bind:value={loginPassword}
								placeholder="Current Login Password"
								class="w-full rounded-xl border px-4 py-3 pr-12 text-center outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								type="button"
								class="absolute right-3 top-3 text-slate-500"
								onclick={() => (showLoginPassword = !showLoginPassword)}
							>
								{#if showLoginPassword}
									<EyeOff size={20} />
								{:else}
									<Eye size={20} />
								{/if}
							</button>
						</div>

						<div class="relative">
							<input
								type={showForgotNewPassword ? 'text' : 'password'}
								bind:value={newForgotPassword}
								placeholder="New Backup Password"
								class="w-full rounded-xl border px-4 py-3 pr-12 text-center outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								type="button"
								class="absolute right-3 top-3 text-slate-500"
								onclick={() => (showForgotNewPassword = !showForgotNewPassword)}
							>
								{#if showForgotNewPassword}
									<EyeOff size={20} />
								{:else}
									<Eye size={20} />
								{/if}
							</button>
						</div>

						<div class="relative">
							<input
								type={showForgotConfirmPassword ? 'text' : 'password'}
								bind:value={confirmForgotPassword}
								placeholder="Confirm Backup Password"
								class="w-full rounded-xl border px-4 py-3 pr-12 text-center outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								type="button"
								class="absolute right-3 top-3 text-slate-500"
								onclick={() => (showForgotConfirmPassword = !showForgotConfirmPassword)}
							>
								{#if showForgotConfirmPassword}
									<EyeOff size={20} />
								{:else}
									<Eye size={20} />
								{/if}
							</button>
						</div>

						<button
							type="submit"
							disabled={loading}
							class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
						>
							<KeyRound size={18} />
							{loading ? 'Resetting...' : 'Reset Backup Password'}
						</button>

						<button
							type="button"
							class="text-sm font-semibold text-slate-500 hover:underline"
							onclick={() => {
								error = '';
								success = '';
								forgotMode = false;
							}}
						>
							Back to Unlock
						</button>
					</form>
				{/if}
			</div>
		</div>
	{:else}
		<div class="mb-8">
			<h2 class="text-3xl font-bold text-slate-900">Backup & Restore</h2>
			<p class="mt-1 text-slate-500">Export or restore your Invoice System data</p>
		</div>

		{#if error}
			<div class="mb-4 rounded-xl bg-red-50 p-4 text-red-600">{error}</div>
		{/if}

		{#if success}
			<div class="mb-4 rounded-xl bg-green-50 p-4 text-green-600">{success}</div>
		{/if}

		<div class="grid gap-6 md:grid-cols-2">
			<div class="rounded-2xl bg-white p-8 shadow">
				<div class="mb-6 flex items-center gap-4">
					<div class="rounded-xl bg-blue-100 p-4 text-blue-600">
						<DatabaseBackup size={30} />
					</div>
					<div>
						<h3 class="text-xl font-bold">Export Backup</h3>
						<p class="text-slate-500">Download all customers, invoices and expenses</p>
					</div>
				</div>

				<button
					type="button"
					onclick={handleExport}
					disabled={loading}
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
				>
					<Download size={20} />
					{loading ? 'Processing...' : 'Download Backup'}
				</button>
			</div>

			<div class="rounded-2xl bg-white p-8 shadow">
				<div class="mb-6 flex items-center gap-4">
					<div class="rounded-xl bg-green-100 p-4 text-green-600">
						<Upload size={30} />
					</div>
					<div>
						<h3 class="text-xl font-bold">Restore Backup</h3>
						<p class="text-slate-500">Upload previously downloaded backup file</p>
					</div>
				</div>

				<label
					class="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
				>
					<Upload size={20} />
					{loading ? 'Processing...' : 'Choose JSON File'}
					<input type="file" accept=".json" class="hidden" onchange={handleImport} />
				</label>
			</div>
		</div>
	{/if}
</AppShell>