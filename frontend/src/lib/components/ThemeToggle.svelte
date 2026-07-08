<script>
	import { theme, toggleTheme } from '$lib/stores/theme.store';
	import { Moon, Sun } from 'lucide-svelte';
</script>

<button
	onclick={toggleTheme}
	class="rounded-xl border p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
>
	{#if $theme === 'dark'}
		<Sun size={20} />
	{:else}
		<Moon size={20} />
	{/if}
</button>