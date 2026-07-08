import { db } from '$lib/firebase/firebase';
import {
	addDoc,
	collection,
	getDocs,
	query,
	where,
	orderBy,
	serverTimestamp
} from 'firebase/firestore';

const activityRef = collection(db, 'activityLogs');

export async function addActivityLog(userId, action, module, details = '') {
	await addDoc(activityRef, {
		userId,
		action,
		module,
		details,
		createdAt: serverTimestamp()
	});
}

export async function getActivityLogs(userId) {
	const q = query(
		activityRef,
		where('userId', '==', userId),
		orderBy('createdAt', 'desc')
	);

	const snapshot = await getDocs(q);

	return snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data()
	}));
}