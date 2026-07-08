import { apiRequest } from './api.service';

// Get Expenses
export async function getExpensesByUser() {
	const data = await apiRequest('/expenses');
	return data.expenses || [];
}

// Add Expense
export async function addExpense(expenseData) {
	return await apiRequest('/expenses', {
		method: 'POST',
		body: JSON.stringify(expenseData)
	});
}

// Update Expense
export async function updateExpense(expenseId, expenseData) {
	return await apiRequest(`/expenses/${expenseId}`, {
		method: 'PUT',
		body: JSON.stringify(expenseData)
	});
}

// Delete Expense
export async function deleteExpense(expenseId) {
	return await apiRequest(`/expenses/${expenseId}`, {
		method: 'DELETE'
	});
}