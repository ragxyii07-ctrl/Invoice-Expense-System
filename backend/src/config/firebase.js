const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const path = require('path');

const serviceAccount = require(path.join(__dirname, 'firebase-service-account.json'));

console.log('Firebase Project ID:', serviceAccount.project_id);

if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
	throw new Error('Invalid Firebase service account JSON file');
}

if (!getApps().length) {
	initializeApp({
		credential: cert(serviceAccount)
	});
}

const db = getFirestore();
const auth = getAuth();

module.exports = { db, auth };