const express = require('express');
const { db } = require('../config/firebase');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
	try {
		const snapshot = await db.collection('invoices').where('userId', '==', req.user.uid).get();

		const invoices = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}));

		res.json({
			success: true,
			invoices
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message
		});
	}
});

router.post('/', verifyToken, async (req, res) => {
	try {
		const docRef = await db.collection('invoices').add({
			...req.body,
			userId: req.user.uid,
			status: req.body.status || 'Pending',
			createdAt: new Date()
		});

		res.json({
			success: true,
			id: docRef.id,
			message: 'Invoice created successfully'
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message
		});
	}
});

router.put('/:id/status', verifyToken, async (req, res) => {
	try {
		await db.collection('invoices').doc(req.params.id).update({
			status: req.body.status,
			updatedAt: new Date()
		});

		res.json({
			success: true,
			message: 'Invoice status updated successfully'
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message
		});
	}
});

router.delete('/:id', verifyToken, async (req, res) => {
	try {
		await db.collection('invoices').doc(req.params.id).delete();

		res.json({
			success: true,
			message: 'Invoice deleted successfully'
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message
		});
	}
});

module.exports = router;