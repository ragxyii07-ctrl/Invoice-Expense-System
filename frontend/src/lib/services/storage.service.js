import { storage } from '$lib/firebase/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export function validateLogoFile(file) {
	if (!file) {
		return 'Please select a logo file';
	}

	const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

	if (!allowedTypes.includes(file.type)) {
		return 'Only PNG, JPG, JPEG, WEBP files are allowed';
	}

	if (file.size > 2 * 1024 * 1024) {
		return 'Logo size must be less than 2MB';
	}

	return '';
}

export async function uploadCompanyLogo(userId, file) {
	const validationError = validateLogoFile(file);

	if (validationError) {
		throw new Error(validationError);
	}

	const fileExtension = file.name.split('.').pop();
	const filePath = `company-logos/${userId}/logo.${fileExtension}`;

	const logoRef = ref(storage, filePath);

	await uploadBytes(logoRef, file);

	const logoUrl = await getDownloadURL(logoRef);

	return logoUrl;
}