import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function downloadInvoicePDF(invoice, settings = {}) {
	const doc = new jsPDF();

	// ===== Company Header =====
	doc.setFontSize(22);
	doc.setTextColor(37, 99, 235);
	doc.text(settings.businessName || 'InvoicePro', 15, 18);

	doc.setFontSize(10);
	doc.setTextColor(70);

	if (settings.ownerName)
		doc.text(`Owner : ${settings.ownerName}`, 15, 28);

	if (settings.address)
		doc.text(settings.address, 15, 34);

	if (settings.phone)
		doc.text(`Phone : ${settings.phone}`, 15, 40);

	if (settings.email)
		doc.text(`Email : ${settings.email}`, 15, 46);

	if (settings.gstNumber)
		doc.text(`GST : ${settings.gstNumber}`, 15, 52);

	// ===== Invoice Title =====
	doc.setFontSize(22);
	doc.setTextColor(0);
	doc.text('INVOICE', 155, 18);

	doc.setFontSize(10);

	doc.text(`Invoice No : ${invoice.invoiceNo}`, 140, 30);
	doc.text(`Date : ${invoice.invoiceDate}`, 140, 36);

	if (invoice.dueDate) {
		doc.text(`Due : ${invoice.dueDate}`, 140, 42);
	}

	// ===== Customer =====
	doc.setFontSize(13);
	doc.text('Bill To', 15, 68);

	doc.setFontSize(10);

	doc.text(invoice.customerName || '', 15, 76);

	if (invoice.customerEmail)
		doc.text(invoice.customerEmail, 15, 82);

	if (invoice.customerPhone)
		doc.text(invoice.customerPhone, 15, 88);

	// ===== Items Table =====
	autoTable(doc, {
		startY: 98,
		head: [['Product', 'Qty', 'Price', 'Total']],
		body: (invoice.items || []).map((item) => [
			item.name,
			item.qty,
			`₹${Number(item.price).toFixed(2)}`,
			`₹${(Number(item.qty) * Number(item.price)).toFixed(2)}`
		]),
		theme: 'grid',
		headStyles: {
			fillColor: [37, 99, 235]
		}
	});

	const finalY = doc.lastAutoTable.finalY + 12;

	doc.setFontSize(11);

	doc.text(
		`Subtotal : ₹${Number(invoice.subtotal || 0).toFixed(2)}`,
		135,
		finalY
	);

	doc.text(
		`GST : ₹${Number(invoice.gstAmount || 0).toFixed(2)}`,
		135,
		finalY + 8
	);

	doc.setFontSize(15);
	doc.setTextColor(22, 163, 74);

	doc.text(
		`Grand Total : ₹${Number(invoice.grandTotal || 0).toFixed(2)}`,
		120,
		finalY + 22
	);

	// ===== Signature =====
	doc.setDrawColor(180);
	doc.line(140, finalY + 42, 195, finalY + 42);

	doc.setFontSize(10);
	doc.setTextColor(80);

	doc.text('Authorized Signature', 145, finalY + 48);

	// ===== Footer =====
	doc.setFontSize(11);

	doc.text(
		'Thank you for your business!',
		15,
		285
	);

	doc.save(`${invoice.invoiceNo || 'Invoice'}.pdf`);
}