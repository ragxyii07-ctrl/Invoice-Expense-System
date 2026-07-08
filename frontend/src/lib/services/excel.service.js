import * as XLSX from 'xlsx';

function formatDate(value) {
	if (!value) return '-';
	return value;
}

export function exportReportsToExcel(report) {
	const summaryData = [
		['Report Name', 'Invoice & Expense Summary'],
		['Total Customers', report.totalCustomers || 0],
		['Total Invoices', report.totalInvoices || 0],
		['Total Revenue', report.totalRevenue || 0],
		['Total Expenses', report.totalExpenses || 0],
		['Net Profit', report.netProfit || 0],
		['Pending Invoices', report.pendingInvoices || 0],
		['Paid Invoices', report.paidInvoices || 0]
	];

	const invoiceData = (report.recentInvoices || []).map((invoice) => ({
		'Invoice No': invoice.invoiceNo || '-',
		Customer: invoice.customerName || '-',
		Date: formatDate(invoice.invoiceDate),
		Amount: invoice.grandTotal || 0,
		Status: invoice.status || 'Pending'
	}));

	const expenseData = (report.recentExpenses || []).map((expense) => ({
		Title: expense.title || '-',
		Category: expense.category || '-',
		Date: formatDate(expense.expenseDate),
		Amount: expense.amount || 0
	}));

	const workbook = XLSX.utils.book_new();

	const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
	const invoiceSheet = XLSX.utils.json_to_sheet(invoiceData);
	const expenseSheet = XLSX.utils.json_to_sheet(expenseData);

	XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
	XLSX.utils.book_append_sheet(workbook, invoiceSheet, 'Invoices');
	XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Expenses');

	XLSX.writeFile(workbook, 'Business_Report.xlsx');
}