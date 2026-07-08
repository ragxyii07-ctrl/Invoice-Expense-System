const express = require('express');
const { db } = require('../config/firebase');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/summary', verifyToken, async (req, res) => {
	try {
		const userId = req.user.uid;

		const [customersSnap, invoicesSnap, expensesSnap] = await Promise.all([
			db.collection('customers').where('userId', '==', userId).get(),
			db.collection('invoices').where('userId', '==', userId).get(),
			db.collection('expenses').where('userId', '==', userId).get()
		]);

		const customers = customersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		const invoices = invoicesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		const expenses = expensesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

		const totalRevenue = invoices.reduce((sum, invoice) => sum + Number(invoice.grandTotal || 0), 0);
		const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

		res.json({
			success: true,
			report: {
				totalCustomers: customers.length,
				activeCustomers: customers.filter((c) => c.status !== 'Inactive').length,
				inactiveCustomers: customers.filter((c) => c.status === 'Inactive').length,

				totalInvoices: invoices.length,
				totalExpensesCount: expenses.length,

				totalRevenue,
				totalExpenses,
				netProfit: totalRevenue - totalExpenses,

				pendingInvoices: invoices.filter((i) => i.status === 'Pending').length,
				paidInvoices: invoices.filter((i) => i.status === 'Paid').length,
				overdueInvoices: invoices.filter((i) => i.status === 'Overdue').length,

				recentInvoices: invoices.slice(0, 5),
				recentExpenses: expenses.slice(0, 5)
			}
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message
		});
	}
});

module.exports = router;