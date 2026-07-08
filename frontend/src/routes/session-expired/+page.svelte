<script>
	import { goto } from '$app/navigation';
	import { ShieldAlert } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let seconds = $state(5);

	onMount(() => {
		const interval = setInterval(() => {
			seconds -= 1;

			if (seconds <= 0) {
				clearInterval(interval);
				goto('/login');
			}
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<section class="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 px-4">
	<div class="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-2xl">
		<div class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-600">
			<ShieldAlert size={50} />
		</div>

		<h1 class="mt-6 text-4xl font-extrabold text-slate-900">Session Expired</h1>

		<p class="mt-4 text-lg text-slate-600">
			For your security, your session expired due to inactivity.
		</p>

		<p class="mt-3 font-semibold text-red-600">
			Redirecting to Login in {seconds}s...
		</p>

		<button
			type="button"
			class="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
			onclick={() => goto('/login')}
		>
			Login Again
		</button>
	</div>
</section>