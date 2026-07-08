<script>
	import { registerUser } from '$lib/services/auth.service';
	import { goto } from '$app/navigation';
	import { UserPlus, Mail, Lock, Building2, User, Eye, EyeOff, Phone, ShieldCheck } from 'lucide-svelte';

	let fullName = $state('');
	let businessName = $state('');
	let email = $state('');
	let mobile = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let role = $state('owner');

	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	let loading = $state(false);
	let error = $state('');
	let success = $state('');

	async function handleRegister() {
		error = '';
		success = '';

		if (!fullName || !businessName || !email || !mobile || !password || !confirmPassword || !role) {
			error = 'All fields are required';
			return;
		}

		if (mobile.length !== 10) {
			error = 'Enter valid 10 digit mobile number';
			return;
		}

		if (password.length < 6) {
			error = 'Password must be at least 6 characters';
			return;
		}

		if (password !== confirmPassword) {
			error = 'Password and confirm password do not match';
			return;
		}

		try {
			loading = true;

			await registerUser({
				fullName,
				businessName,
				email,
				mobile: `+91${mobile}`,
				password,
				role
			});

			success = 'Account created successfully';
			alert('Account created successfully. Please login.');
			await goto('/login');
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}
</script>

<section class="flex min-h-screen items-center justify-center bg-slate-100 px-4">
	<div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
		<div class="mb-8 text-center">
			<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
				<UserPlus size={30} />
			</div>
			<h1 class="mt-4 text-3xl font-bold text-slate-900">Create Account</h1>
			<p class="mt-2 text-slate-500">Register your business account</p>
		</div>

		{#if error}
			<p class="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
		{/if}

		{#if success}
			<p class="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">{success}</p>
		{/if}

		<form onsubmit={handleRegister} class="space-y-4">
			<div class="relative">
				<User class="absolute left-3 top-3 text-slate-400" size={20} />
				<input bind:value={fullName} placeholder="Full Name" class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500" />
			</div>

			<div class="relative">
				<Building2 class="absolute left-3 top-3 text-slate-400" size={20} />
				<input bind:value={businessName} placeholder="Business Name" class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500" />
			</div>

			<div class="relative">
				<ShieldCheck class="absolute left-3 top-3 text-slate-400" size={20} />
				<select bind:value={role} class="w-full rounded-xl border bg-white py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500">
					<option value="owner">Owner</option>
					<option value="secretary">Secretary</option>
				</select>
			</div>

			<div class="relative">
				<Mail class="absolute left-3 top-3 text-slate-400" size={20} />
				<input type="email" bind:value={email} placeholder="Email Address" class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500" />
			</div>

			<div class="relative">
				<Phone class="absolute left-3 top-3 text-slate-400" size={20} />
				<input bind:value={mobile} maxlength="10" placeholder="Mobile Number" class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500" />
			</div>

			<div class="relative">
				<Lock class="absolute left-3 top-3 text-slate-400" size={20} />
				<input type={showPassword ? 'text' : 'password'} bind:value={password} placeholder="Password" class="w-full rounded-xl border py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-blue-500" />
				<button type="button" onclick={() => (showPassword = !showPassword)} class="absolute right-3 top-3 text-slate-400">
					{#if showPassword}<EyeOff size={20} />{:else}<Eye size={20} />{/if}
				</button>
			</div>

			<div class="relative">
				<Lock class="absolute left-3 top-3 text-slate-400" size={20} />
				<input type={showConfirmPassword ? 'text' : 'password'} bind:value={confirmPassword} placeholder="Confirm Password" class="w-full rounded-xl border py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-blue-500" />
				<button type="button" onclick={() => (showConfirmPassword = !showConfirmPassword)} class="absolute right-3 top-3 text-slate-400">
					{#if showConfirmPassword}<EyeOff size={20} />{:else}<Eye size={20} />{/if}
				</button>
			</div>

			<button type="submit" disabled={loading} class="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
				{loading ? 'Creating Account...' : 'Register'}
			</button>
		</form>

		<p class="mt-6 text-center text-slate-500">
			Already have an account?
			<a href="/login" class="font-semibold text-blue-600">Login</a>
		</p>
	</div>
</section>