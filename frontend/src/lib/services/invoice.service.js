import { apiRequest } from './api.service';

// Get Invoices
export async function getInvoicesByUser() {
	const data = await apiRequest('/invoices');
	return data.invoices || [];
}

// Add Invoice
export async function addInvoice(invoiceData) {
	return await apiRequest('/invoices', {
		method: 'POST',
		body: JSON.stringify(invoiceData)
	});
}

// Update Invoice Status
export async function updateInvoiceStatus(invoiceId, status) {
	return await apiRequest(`/invoices/${invoiceId}/status`, {
		method: 'PUT',
		body: JSON.stringify({ status })
	});
}

// Delete Invoice
export async function deleteInvoice(invoiceId) {
	return await apiRequest(`/invoices/${invoiceId}`, {
		method: 'DELETE'
	});
}

// Send Invoice Email
export async function sendInvoiceEmail(invoiceId) {
	if (!invoiceId) {
		throw new Error('Invoice ID is required');
	}

	return await apiRequest('/email/send', {
		method: 'POST',
		body: JSON.stringify({ invoiceId })
	});
}
