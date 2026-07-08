import { db } from '$lib/firebase/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function getBusinessSettings(userId) {
	if (!userId) return null;

	const ref = doc(db, 'settings', userId);
	const snap = await getDoc(ref);

	if (!snap.exists()) return null;

	return {
		id: snap.id,
		...snap.data()
	};
}

export async function saveBusinessSettings(userId, data) {
	if (!userId) {
		throw new Error('User ID is required');
	}

	const ref = doc(db, 'settings', userId);

	await setDoc(
		ref,
		{
			...data,
			updatedAt: serverTimestamp()
		},
		{ merge: true }
	);

	return true;
}

export function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => resolve(reader.result);
		reader.onerror = () => reject(new Error('Failed to read image'));

		reader.readAsDataURL(file);
	});
}