import { auth, db } from '$lib/firebase/firebase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function registerUser({ fullName, businessName, email, mobile, password, role }) {
	const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	const user = userCredential.user;

	await setDoc(doc(db, 'users', user.uid), {
	uid: user.uid,
	fullName,
	businessName,
	email,
	mobile,
	role: role || 'owner',
	status: 'active',
	createdAt: serverTimestamp(),
	lastLogin: null
});

	return user;
}

export async function loginUser(email, password) {
	const userCredential = await signInWithEmailAndPassword(auth, email, password);
	return userCredential.user;
}

export async function logoutUser() {
	await signOut(auth);
}