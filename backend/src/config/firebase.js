const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

const serviceAccount = {
	projectId: process.env.FIREBASE_PROJECT_ID,
	clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
	privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

console.log('Firebase Project ID:', serviceAccount.projectId);

if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
	throw new Error('Missing Firebase Admin environment variables');
}

if (!getApps().length) {
	initializeApp({
		credential: cert(serviceAccount),
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET
	});
}

const db = getFirestore();
const auth = getAuth();

module.exports = { db, auth };