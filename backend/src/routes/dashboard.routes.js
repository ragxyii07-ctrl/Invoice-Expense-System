const express = require('express');
const { db } = require('../config/firebase');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
	try {
		const uid = req.user.uid;

		const [customerSnap, invoiceSnap, expenseSnap, secretarySnap] =
			await Promise.all([
				db.collection('customers').where('userId', '==', uid).get(),
				db.collection('invoices').where('userId', '==', uid).get(),
				db.collection('expenses').where('userId', '==', uid).get(),
				db.collection('secretaries').where('ownerId', '==', uid).get()
			]);

		let totalRevenue = 0;
		let totalExpenses = 0;

		let pendingInvoices = 0;
		let paidInvoices = 0;

		invoiceSnap.forEach((doc) => {
			const invoice = doc.data();

			totalRevenue += Number(invoice.grandTotal || 0);

			if (invoice.status === 'Paid') {
				paidInvoices++;
			} else {
				pendingInvoices++;
			}
		});

		expenseSnap.forEach((doc) => {
			const expense = doc.data();
			totalExpenses += Number(expense.amount || 0);
		});

		const totalCustomers = customerSnap.size;
		const activeCustomers = totalCustomers;
		const inactiveCustomers = 0;

		res.json({
			success: true,
			report: {
				totalCustomers,
				activeCustomers,
				inactiveCustomers,

				totalInvoices: invoiceSnap.size,
				totalExpenses: expenseSnap.size,

				totalRevenue,
				netProfit: totalRevenue - totalExpenses,

				pendingInvoices,
				paidInvoices,

				secretaryCount: secretarySnap.size
			}
		});
	} catch (err) {
		console.error(err);

		res.status(500).json({
			success: false,
			message: err.message
		});
	}
});

module.exports = router;