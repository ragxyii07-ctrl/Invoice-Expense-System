import { db } from '$lib/firebase/firebase';
import {
	addDoc,
	collection,
	getDocs,
	query,
	where,
	serverTimestamp,
	deleteDoc,
	doc
} from 'firebase/firestore';

const secretaryRef = collection(db, 'secretaries');

export async function addSecretary(data) {
	await addDoc(secretaryRef, {
		...data,
		role: 'secretary',
		status: 'active',
		createdAt: serverTimestamp()
	});
}

export async function getSecretaries(ownerId) {
	const q = query(secretaryRef, where('ownerId', '==', ownerId));

	const snapshot = await getDocs(q);

	return snapshot.docs.map((docItem) => ({
		id: docItem.id,
		...docItem.data()
	}));
}

export async function deleteSecretary(id) {
	await deleteDoc(doc(db, 'secretaries', id));
}