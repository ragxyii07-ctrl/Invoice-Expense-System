const { db } = require('../config/firebase');

async function getMonthlyAnalytics(userId) {
	const revenue = Array(12).fill(0);
	const expenses = Array(12).fill(0);

	const invoiceSnapshot = await db.collection('invoices').where('userId', '==', userId).get();

	invoiceSnapshot.forEach((doc) => {
		const data = doc.data();

		if (!data.invoiceDate) return;

		const month = new Date(data.invoiceDate).getMonth();
		revenue[month] += Number(data.grandTotal || 0);
	});

	const expenseSnapshot = await db.collection('expenses').where('userId', '==', userId).get();

	expenseSnapshot.forEach((doc) => {
		const data = doc.data();

		if (!data.expenseDate) return;

		const month = new Date(data.expenseDate).getMonth();
		expenses[month] += Number(data.amount || 0);
	});

	return {
		revenue,
		expenses
	};
}

module.exports = {
	getMonthlyAnalytics
};