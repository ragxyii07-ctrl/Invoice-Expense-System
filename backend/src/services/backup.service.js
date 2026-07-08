const { db } = require('../config/firebase');

async function exportUserData(userId) {
	const collections = ['customers', 'invoices', 'expenses'];

	const backup = {};

	for (const collectionName of collections) {
		const snapshot = await db
			.collection(collectionName)
			.where('userId', '==', userId)
			.get();

		backup[collectionName] = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}));
	}

	return backup;
}

async function restoreUserData(userId, backupData) {
	const collections = ['customers', 'invoices', 'expenses'];

	for (const collectionName of collections) {
		if (!backupData[collectionName]) continue;

		for (const item of backupData[collectionName]) {
			delete item.id;

			await db.collection(collectionName).add({
				...item,
				userId
			});
		}
	}
}

module.exports = {
	exportUserData,
	restoreUserData
};