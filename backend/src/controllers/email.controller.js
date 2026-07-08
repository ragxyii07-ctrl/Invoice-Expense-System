const { db } = require('../config/firebase');
const invoiceTemplate = require('../templates/invoiceTemplate');
const { generateInvoicePdf } = require('../services/pdf.service');
const { sendMailWithAttachment } = require('../services/email.service');

async function sendInvoiceEmail(req, res) {
	try {
		const { invoiceId } = req.body;
		const uid = req.user.uid;

		if (!invoiceId) {
			return res.status(400).json({
				success: false,
				message: 'Invoice ID is required'
			});
		}

		const invoiceDoc = await db.collection('invoices').doc(invoiceId).get();

		if (!invoiceDoc.exists) {
			return res.status(404).json({
				success: false,
				message: 'Invoice not found'
			});
		}

		const invoice = {
			id: invoiceDoc.id,
			...invoiceDoc.data()
		};

		if (invoice.userId !== uid) {
			return res.status(403).json({
				success: false,
				message: 'Access denied'
			});
		}

		let customer = {};
		if (invoice.customerId) {
			const customerDoc = await db.collection('customers').doc(invoice.customerId).get();
			customer = customerDoc.exists ? { id: customerDoc.id, ...customerDoc.data() } : {};
		}

		const customerEmail = invoice.customerEmail || customer.email || '';

		if (!customerEmail) {
			return res.status(400).json({
				success: false,
				message: 'Customer email not found'
			});
		}

		if (!invoice.customerEmail && customerEmail) {
			await db.collection('invoices').doc(invoiceId).update({
				customerEmail
			});
			invoice.customerEmail = customerEmail;
		}

		const settingsDoc = await db.collection('settings').doc(uid).get();
		const settings = settingsDoc.exists ? settingsDoc.data() : {};

		const html = invoiceTemplate({
			invoice,
			customer,
			settings
		});

		const pdfBuffer = await generateInvoicePdf(html);

		await sendMailWithAttachment({
			to: customerEmail,
			subject: `Invoice ${invoice.invoiceNo}`,
			html: `
				<h2>Invoice ${invoice.invoiceNo}</h2>
				<p>Dear ${customer.name || invoice.customerName || 'Customer'},</p>
				<p>Please find your invoice attached.</p>
				<p>Thank you for your business.</p>
			`,
			attachments: [
				{
					filename: `${invoice.invoiceNo}.pdf`,
					content: pdfBuffer,
					contentType: 'application/pdf'
				}
			]
		});

		return res.json({
			success: true,
			message: 'Invoice email sent successfully'
		});
	} catch (error) {
		console.error('Send Invoice Email Error:', error);

		return res.status(500).json({
			success: false,
			message: error.message || 'Failed to send invoice email'
		});
	}
}

module.exports = {
	sendInvoiceEmail
};