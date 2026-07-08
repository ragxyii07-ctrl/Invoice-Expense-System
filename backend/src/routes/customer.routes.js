const express = require('express');
const { db } = require('../config/firebase');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
	try {
		const snapshot = await db.collection('customers').where('userId', '==', req.user.uid).get();

		const customers = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}));

		res.json({
			success: true,
			customers
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

router.post('/', verifyToken, async (req, res) => {
	try {
		const docRef = await db.collection('customers').add({
			...req.body,
			userId: req.user.uid,
			status: req.body.status || 'Active',
			createdAt: new Date()
		});

		res.json({
			success: true,
			id: docRef.id,
			message: 'Customer created successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

router.put('/:id', verifyToken, async (req, res) => {
	try {
		await db.collection('customers').doc(req.params.id).update({
			...req.body,
			updatedAt: new Date()
		});

		res.json({
			success: true,
			message: 'Customer updated successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

router.delete('/:id', verifyToken, async (req, res) => {
	try {
		await db.collection('customers').doc(req.params.id).delete();

		res.json({
			success: true,
			message: 'Customer deleted successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

module.exports = router;