import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function downloadInvoicePDF(invoice, settings = {}) {
	const doc = new jsPDF('p', 'mm', 'a4');

	const pageWidth = doc.internal.pageSize.getWidth();

	const businessName = settings.businessName || 'InvoicePro';
	const ownerName = settings.ownerName || '';
	const email = settings.email || '';
	const phone = settings.phone || '';
	const address = settings.address || '';
	const gstNumber = settings.gstNumber || '';

	doc.setFillColor(37, 99, 235);
	doc.rect(0, 0, pageWidth, 32, 'F');

	doc.setTextColor(255, 255, 255);
	doc.setFontSize(22);
	doc.setFont('helvetica', 'bold');
	doc.text(businessName, 14, 18);

	doc.setFontSize(10);
	doc.setFont('helvetica', 'normal');
	doc.text('Invoice & Expense Management System', 14, 25);

	doc.setFontSize(24);
	doc.setFont('helvetica', 'bold');
	doc.text('INVOICE', pageWidth - 14, 18, { align: 'right' });

	doc.setTextColor(30, 41, 59);
	doc.setFontSize(10);

	let y = 42;

	doc.setFont('helvetica', 'bold');
	doc.text('From:', 14, y);
	doc.setFont('helvetica', 'normal');
	doc.text(businessName, 14, y + 7);
	if (ownerName) doc.text(ownerName, 14, y + 13);
	if (email) doc.text(email, 14, y + 19);
	if (phone) doc.text(phone, 14, y + 25);
	if (gstNumber) doc.text(`GST: ${gstNumber}`, 14, y + 31);
	if (address) doc.text(address, 14, y + 37, { maxWidth: 80 });

	doc.setFont('helvetica', 'bold');
	doc.text('Bill To:', 120, y);
	doc.setFont('helvetica', 'normal');
	doc.text(invoice.customerName || '-', 120, y + 7);

	doc.setFont('helvetica', 'bold');
	doc.text('Invoice Details:', 120, y + 22);
	doc.setFont('helvetica', 'normal');
	doc.text(`Invoice No: ${invoice.invoiceNo || '-'}`, 120, y + 29);
	doc.text(`Invoice Date: ${invoice.invoiceDate || '-'}`, 120, y + 36);
	doc.text(`Due Date: ${invoice.dueDate || '-'}`, 120, y + 43);
	doc.text(`Status: ${invoice.status || 'Pending'}`, 120, y + 50);

	const rows = (invoice.items || []).map((item) => [
		item.product || '-',
		item.qty || 0,
		`Rs. ${Number(item.price || 0).toLocaleString('en-IN')}`,
		`Rs. ${Number(item.total || 0).toLocaleString('en-IN')}`
	]);

	autoTable(doc, {
		startY: 100,
		head: [['Product / Service', 'Qty', 'Price', 'Total']],
		body: rows,
		theme: 'grid',
		headStyles: {
			fillColor: [37, 99, 235],
			textColor: 255,
			fontStyle: 'bold'
		},
		styles: {
			fontSize: 10,
			cellPadding: 3
		}
	});

	const finalY = doc.lastAutoTable.finalY + 12;
	const rightX = pageWidth - 14;

	doc.setFontSize(11);
	doc.text(`Subtotal: Rs. ${Number(invoice.subtotal || 0).toLocaleString('en-IN')}`, rightX, finalY, {
		align: 'right'
	});
	doc.text(
		`GST (${invoice.gst || 0}%): Rs. ${Number(invoice.taxAmount || 0).toLocaleString('en-IN')}`,
		rightX,
		finalY + 8,
		{ align: 'right' }
	);

	doc.setFontSize(15);
	doc.setFont('helvetica', 'bold');
	doc.text(
		`Grand Total: Rs. ${Number(invoice.grandTotal || 0).toLocaleString('en-IN')}`,
		rightX,
		finalY + 20,
		{ align: 'right' }
	);

	if (invoice.notes) {
		doc.setFontSize(10);
		doc.setFont('helvetica', 'bold');
		doc.text('Notes:', 14, finalY + 35);
		doc.setFont('helvetica', 'normal');
		doc.text(invoice.notes, 14, finalY + 42, { maxWidth: 120 });
	}

	doc.setFontSize(10);
	doc.setFont('helvetica', 'normal');
	doc.line(130, 260, 190, 260);
	doc.text('Authorized Signature', 145, 267);

	doc.setFillColor(241, 245, 249);
	doc.rect(0, 282, pageWidth, 15, 'F');
	doc.setTextColor(100, 116, 139);
	doc.text('Thank you for your business!', pageWidth / 2, 291, { align: 'center' });

	doc.save(`${invoice.invoiceNo || 'invoice'}.pdf`);
}