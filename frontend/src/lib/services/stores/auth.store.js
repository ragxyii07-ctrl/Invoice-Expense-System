import { auth, db } from '$lib/firebase/firebase';
import { writable } from 'svelte/store';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const currentUser = writable(null);
export const currentUserRole = writable(null);
export const currentUserData = writable(null);
export const authLoading = writable(true);

onAuthStateChanged(auth, async (user) => {
	authLoading.set(true);

	if (!user) {
		currentUser.set(null);
		currentUserRole.set(null);
		currentUserData.set(null);
		authLoading.set(false);
		return;
	}

	try {
		const userRef = doc(db, 'users', user.uid);
		const snapshot = await getDoc(userRef);

		let data;

		if (snapshot.exists()) {
			data = snapshot.data();
		} else {
			data = {
				email: user.email,
				role: 'owner',
				status: 'active',
				createdAt: serverTimestamp()
			};

			await setDoc(userRef, data);
		}

		currentUser.set(user);
		currentUserRole.set(data.role || 'owner');
		currentUserData.set(data);
	} catch (error) {
		console.error('Auth Store Error:', error);

		currentUser.set(user);
		currentUserRole.set('owner');
		currentUserData.set({
			email: user.email,
			role: 'owner'
		});
	} finally {
		authLoading.set(false);
	}
});