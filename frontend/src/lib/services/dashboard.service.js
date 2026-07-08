import { apiRequest } from './api.service';

export async function getDashboardData() {
	const response = await apiRequest('/dashboard');

	return response?.report ?? response;
}