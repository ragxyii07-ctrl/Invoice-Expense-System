const { db } = require('../config/firebase');

const collections = [
	'customers',
	'invoices',
	'expenses',
	'settings',
	'activityLogs',
	'secretaries'
];

exports.exportBackup = async (req, res) => {
	try {
		const uid = req.user.uid;
		const backup = {
			exportedAt: new Date().toISOString(),
			userId: uid,
			data: {}
		};

		for (const name of collections) {
			const snap = await db.collection(name).where('userId', '==', uid).get();

			backup.data[name] = snap.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			}));
		}

		res.json({
			success: true,
			backup
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

exports.importBackup = async (req, res) => {
	try {
		const uid = req.user.uid;
		const { backup } = req.body;

		if (!backup?.data) {
			return res.status(400).json({
				success: false,
				message: 'Invalid backup file'
			});
		}

		for (const name of collections) {
			const items = backup.data[name] || [];

			for (const item of items) {
				const { id, ...data } = item;

				await db.collection(name).doc(id).set(
					{
						...data,
						userId: uid,
						restoredAt: new Date()
					},
					{ merge: true }
				);
			}
		}

		res.json({
			success: true,
			message: 'Backup restored successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};