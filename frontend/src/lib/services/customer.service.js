import { apiRequest } from './api.service';

export async function addCustomer(customerData) {
	const data = await apiRequest('/customers', {
		method: 'POST',
		body: JSON.stringify(customerData)
	});

	return data;
}

export async function getCustomersByUser() {
	const data = await apiRequest('/customers');
	return data.customers || [];
}

export async function updateCustomer(customerId, customerData) {
	const data = await apiRequest(`/customers/${customerId}`, {
		method: 'PUT',
		body: JSON.stringify(customerData)
	});

	return data;
}

export async function updateCustomerStatus(customerId, status) {
	const data = await apiRequest(`/customers/${customerId}`, {
		method: 'PUT',
		body: JSON.stringify({ status })
	});

	return data;
}

export async function deleteCustomer(customerId) {
	const data = await apiRequest(`/customers/${customerId}`, {
		method: 'DELETE'
	});

	return data;
}