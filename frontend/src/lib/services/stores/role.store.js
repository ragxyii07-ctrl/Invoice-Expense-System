import { writable } from 'svelte/store';

export const userRole = writable('owner');

export function setUserRole(role) {
	userRole.set(role || 'owner');
}