import { apiRequest } from './api.service';

export async function exportBackup() {
	const response = await apiRequest('/backup/export');
	return response.backup;
}

export async function importBackup(backup) {
	return await apiRequest('/backup/import', {
		method: 'POST',
		body: JSON.stringify({ backup })
	});
}

export function downloadBackupFile(data) {
	const blob = new Blob([JSON.stringify(data, null, 2)], {
		type: 'application/json'
	});

	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');

	link.href = url;
	link.download = `invoice-expense-backup-${Date.now()}.json`;

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(url);
}