import { apiRequest } from './api.service';

export async function getMonthlyAnalytics() {
	const result = await apiRequest('/analytics');

	return {
		revenue: result?.data?.revenue || Array(12).fill(0),
		expenses: result?.data?.expenses || Array(12).fill(0)
	};
}