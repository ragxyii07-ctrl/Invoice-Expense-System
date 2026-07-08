const puppeteer = require('puppeteer');

async function generateInvoicePdf(html) {
	const browser = await puppeteer.launch({
		headless: 'new',
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	const page = await browser.newPage();

	await page.setContent(html, {
		waitUntil: 'networkidle0'
	});

	const pdfBuffer = await page.pdf({
		format: 'A4',
		printBackground: true,
		margin: {
			top: '0px',
			right: '0px',
			bottom: '0px',
			left: '0px'
		}
	});

	await browser.close();

	return pdfBuffer;
}

module.exports = {
	generateInvoicePdf
};