<script>
	import { loginUser } from '$lib/services/auth.service';
	import { goto } from '$app/navigation';
	import { LogIn, Mail, Lock, Eye, EyeOff, KeyRound, XCircle } from 'lucide-svelte';
	import { getBusinessSettings } from '$lib/services/settings.service';
	import { auth } from '$lib/firebase/firebase';
	import { sendPasswordResetEmail } from 'firebase/auth';

	let showWelcome = $state(false);
	let welcomeName = $state('');
	let welcomeLogo = $state('');

	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);

	let loading = $state(false);
	let error = $state('');

	let showForgotPassword = $state(false);
	let forgotEmail = $state('');
	let forgotMessage = $state('');
	let forgotLoading = $state(false);

	async function handleLogin() {
	error = '';
	forgotMessage = '';

	if (!email || !password) {
		error = 'Email and password are required';
		return;
	}

	try {
		loading = true;

		await loginUser(email, password);

		const user = auth.currentUser;

		welcomeName = user?.displayName || user?.email?.split('@')[0] || email;

		try {
			if (user?.uid) {
				const settings = await getBusinessSettings(user.uid);
				welcomeLogo = settings?.logoUrl || '';
				welcomeName = settings?.ownerName || welcomeName;
			}
		} catch {
			welcomeLogo = '';
		}

		loading = false;
		showWelcome = true;

		setTimeout(() => {
			goto('/dashboard', { replaceState: true });
		}, 2000);
	} catch (err) {
		error = err.message || 'Invalid email or password';
		loading = false;
	}
}

	async function handleForgotPassword() {
		error = '';
		forgotMessage = '';

		const resetEmail = forgotEmail || email;

		if (!resetEmail) {
			error = 'Enter your email address';
			return;
		}

		try {
			forgotLoading = true;

			await sendPasswordResetEmail(auth, resetEmail);

			forgotMessage = 'Password reset link sent to your Gmail';
			forgotEmail = resetEmail;
		} catch (err) {
			error = err.message || 'Unable to send reset link';
		} finally {
			forgotLoading = false;
		}
	}
</script>

{#if showWelcome}
	<section
		class="flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 px-4"
	>
		<div class="absolute h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
		<div class="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl"></div>

		<div
			class="relative w-full max-w-lg rounded-3xl border border-white/30 bg-white/15 p-10 text-center text-white shadow-2xl backdrop-blur-xl"
		>
			{#if welcomeLogo}
				<img
					src={welcomeLogo}
					alt="Company Logo"
					class="mx-auto mb-6 h-24 w-24 rounded-3xl border-4 border-white/40 bg-white object-cover shadow-xl"
				/>
			{:else}
				<div
					class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 text-5xl shadow-xl"
				>
					👋
				</div>
			{/if}

			<h1 class="text-4xl font-extrabold">Welcome Back</h1>
			<p class="mt-3 text-2xl font-bold">{welcomeName}</p>
			<p class="mt-4 text-lg text-blue-100">
				Welcome to Invoice & Expense Management System
			</p>

			<div class="mx-auto mt-8 h-2 w-56 overflow-hidden rounded-full bg-white/30">
				<div class="h-full w-full animate-pulse rounded-full bg-white"></div>
			</div>
		</div>
	</section>
{:else}
	<section class="flex min-h-screen items-center justify-center bg-slate-100 px-4">
		<div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
			<div class="mb-8 text-center">
				<div
					class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white"
				>
					<LogIn size={30} />
				</div>

				<h1 class="mt-4 text-3xl font-bold text-slate-900">Welcome Back</h1>
				<p class="mt-2 text-slate-500">Login to your business dashboard</p>
			</div>

			{#if error}
				<p class="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
			{/if}

			{#if forgotMessage}
				<p class="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">
					{forgotMessage}
				</p>
			{/if}

			<form
				onsubmit={(event) => {
					event.preventDefault();
					handleLogin();
				}}
				class="space-y-4"
			>
				<div class="relative">
					<Mail class="absolute left-3 top-3 text-slate-400" size={20} />
					<input
						type="email"
						bind:value={email}
						placeholder="example@gmail.com"
						autocomplete="email"
						class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div class="relative">
					<Lock class="absolute left-3 top-3 text-slate-400" size={20} />
					<input
						type={showPassword ? 'text' : 'password'}
						bind:value={password}
						placeholder="Password"
						autocomplete="current-password"
						class="w-full rounded-xl border py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<button
						type="button"
						class="absolute right-3 top-3 text-slate-500 hover:text-blue-600"
						onclick={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							<EyeOff size={20} />
						{:else}
							<Eye size={20} />
						{/if}
					</button>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
				>
					{loading ? 'Logging in...' : 'Login'}
				</button>
			</form>

			<div class="mt-4 text-center">
				<button
					type="button"
					class="text-sm font-semibold text-blue-600 hover:underline"
					onclick={() => {
						showForgotPassword = !showForgotPassword;
						forgotEmail = email;
						error = '';
						forgotMessage = '';
					}}
				>
					Forgot Password?
				</button>
			</div>

			{#if showForgotPassword}
				<div class="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
					<div class="mb-3 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<div class="rounded-xl bg-blue-600 p-2 text-white">
								<KeyRound size={18} />
							</div>
							<h3 class="font-bold text-slate-900">Reset Password</h3>
						</div>

						<button
							type="button"
							class="text-slate-500 hover:text-red-600"
							onclick={() => {
								showForgotPassword = false;
								error = '';
								forgotMessage = '';
							}}
						>
							<XCircle size={19} />
						</button>
					</div>

					<p class="mb-3 text-sm text-slate-600">
						Enter your Gmail address. Password reset link will be sent to your inbox.
					</p>

					<input
						type="email"
						bind:value={forgotEmail}
						placeholder="Enter your Gmail"
						class="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<button
						type="button"
						onclick={handleForgotPassword}
						disabled={forgotLoading}
						class="mt-3 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
					>
						{forgotLoading ? 'Sending...' : 'Send Reset Link'}
					</button>
				</div>
			{/if}

			<p class="mt-6 text-center text-slate-500">
				Don't have an account?
				<a href="/register" class="font-semibold text-blue-600 hover:underline">
					Register
				</a>
			</p>
		</div>
	</section>
{/if}