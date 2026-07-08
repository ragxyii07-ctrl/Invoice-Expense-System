const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
});

async function sendMailWithAttachment({ to, subject, html, attachments = [] }) {
	if (!to) {
		throw new Error('Customer email is required');
	}

	await transporter.sendMail({
		from: `"InvoicePro" <${process.env.EMAIL_USER}>`,
		to,
		subject,
		html,
		attachments
	});
}

module.exports = {
	sendMailWithAttachment
};