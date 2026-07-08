const express = require('express');
const { db } = require('../config/firebase');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
	try {
		const snapshot = await db.collection('expenses').where('userId', '==', req.user.uid).get();

		const expenses = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}));

		res.json({
			success: true,
			expenses
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
		const docRef = await db.collection('expenses').add({
			...req.body,
			userId: req.user.uid,
			createdAt: new Date()
		});

		res.json({
			success: true,
			id: docRef.id,
			message: 'Expense created successfully'
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message
		});
	}
});

router.put('/:id', verifyToken, async (req, res) => {
	try {
		await db.collection('expenses').doc(req.params.id).update({
			...req.body,
			updatedAt: new Date()
		});

		res.json({
			success: true,
			message: 'Expense updated successfully'
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
		await db.collection('expenses').doc(req.params.id).delete();

		res.json({
			success: true,
			message: 'Expense deleted successfully'
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message
		});
	}
});

module.exports = router;