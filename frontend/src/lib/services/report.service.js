import { apiRequest } from './api.service';

export async function getReportSummary() {
	const data = await apiRequest('/reports/summary');
	return data.report;
}