import { writable } from 'svelte/store';

const savedTheme =
	typeof localStorage !== 'undefined'
		? localStorage.getItem('theme') || 'light'
		: 'light';

export const theme = writable(savedTheme);

theme.subscribe((value) => {
	if (typeof document !== 'undefined') {
		document.documentElement.classList.toggle('dark', value === 'dark');
		localStorage.setItem('theme', value);
	}
});

export function toggleTheme() {
	theme.update((current) => (current === 'light' ? 'dark' : 'light'));
}