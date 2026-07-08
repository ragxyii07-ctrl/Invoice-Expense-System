const { db } = require('../config/firebase');

async function getDashboardSummary(userId) {
	const [
		customerSnapshot,
		invoiceSnapshot,
		expenseSnapshot,
		secretarySnapshot
	] = await Promise.all([
		db.collection('customers').where('userId', '==', userId).get(),
		db.collection('invoices').where('userId', '==', userId).get(),
		db.collection('expenses').where('userId', '==', userId).get(),
		db.collection('secretaries').where('ownerId', '==', userId).get()
	]);

	const customers = customerSnapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data()
	}));

	const invoices = invoiceSnapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data()
	}));

	const expenses = expenseSnapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data()
	}));

	const secretaries = secretarySnapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data()
	}));

	const totalRevenue = invoices.reduce(
		(sum, invoice) => sum + Number(invoice.grandTotal || 0),
		0
	);

	const totalExpenses = expenses.reduce(
		(sum, expense) => sum + Number(expense.amount || 0),
		0
	);

	const paidInvoices = invoices.filter((invoice) => invoice.status === 'Paid').length;
	const pendingInvoices = invoices.filter((invoice) => invoice.status === 'Pending').length;
	const overdueInvoices = invoices.filter((invoice) => invoice.status === 'Overdue').length;

	const activeCustomers = customers.filter(
		(customer) => customer.status !== 'inactive'
	).length;

	const inactiveCustomers = customers.filter(
		(customer) => customer.status === 'inactive'
	).length;

	const recentInvoices = invoices
		.sort((a, b) => new Date(b.invoiceDate || 0) - new Date(a.invoiceDate || 0))
		.slice(0, 5);

	const recentExpenses = expenses
		.sort((a, b) => new Date(b.expenseDate || 0) - new Date(a.expenseDate || 0))
		.slice(0, 5);

	return {
		totalCustomers: customers.length,
		activeCustomers,
		inactiveCustomers,
		secretaryCount: secretaries.length,
		totalInvoices: invoices.length,
		totalRevenue,
		totalExpenses,
		netProfit: totalRevenue - totalExpenses,
		pendingInvoices,
		paidInvoices,
		overdueInvoices,
		recentInvoices,
		recentExpenses
	};
}

module.exports = {
	getDashboardSummary
};