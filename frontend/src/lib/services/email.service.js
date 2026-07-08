import { apiRequest } from './api.service';

export async function sendInvoiceEmail(invoiceId) {
	if (!invoiceId) {
		throw new Error('Invoice ID is required');
	}

	return await apiRequest('/email/send', {
		method: 'POST',
		body: JSON.stringify({ invoiceId })
	});
}