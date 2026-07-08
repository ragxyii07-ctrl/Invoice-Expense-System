import { db } from '$lib/firebase/firebase';
import {
	addDoc,
	collection,
	getDocs,
	query,
	serverTimestamp,
	where,
	orderBy,
	updateDoc,
	deleteDoc,
	doc
} from 'firebase/firestore';

const notificationRef = collection(db, 'notifications');

export async function addNotification(userId, title, message, type = 'info') {
	await addDoc(notificationRef, {
		userId,
		title,
		message,
		type,
		isRead: false,
		createdAt: serverTimestamp()
	});
}

export async function getNotifications(userId) {
	const q = query(
		notificationRef,
		where('userId', '==', userId),
		orderBy('createdAt', 'desc')
	);

	const snapshot = await getDocs(q);

	return snapshot.docs.map((docItem) => ({
		id: docItem.id,
		...docItem.data()
	}));
}

export async function getNotificationsByUser(userId) {
	return await getNotifications(userId);
}

export async function markNotificationAsRead(id) {
	await updateDoc(doc(db, 'notifications', id), {
		isRead: true
	});
}

export async function markAllNotificationsAsRead(userId) {
	const q = query(
		notificationRef,
		where('userId', '==', userId),
		where('isRead', '==', false)
	);

	const snapshot = await getDocs(q);

	const updates = snapshot.docs.map((docItem) =>
		updateDoc(doc(db, 'notifications', docItem.id), {
			isRead: true
		})
	);

	await Promise.all(updates);
}

export async function deleteNotification(id) {
	await deleteDoc(doc(db, 'notifications', id));
}