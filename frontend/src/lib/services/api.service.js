import { auth } from '$lib/firebase/firebase';
import { PUBLIC_API_URL } from '$env/static/public';

const API_BASE_URL = PUBLIC_API_URL;

export async function apiRequest(endpoint, options = {}) {
	const user = auth.currentUser;

	if (!user) {
		throw new Error('User not logged in');
	}

	const token = await user.getIdToken();

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
			...(options.headers || {})
		}
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'API request failed');
	}

	return data;
}