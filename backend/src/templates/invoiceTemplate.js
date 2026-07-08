function money(value) {
	return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function statusColor(status = '') {
	const s = status.toLowerCase();

	if (s === 'paid') return '#16a34a';
	if (s === 'pending') return '#f59e0b';
	if (s === 'overdue') return '#dc2626';

	return '#2563eb';
}

function invoiceTemplate({ invoice, customer, settings }) {
	const items = invoice.items || [];

	const subtotal = Number(invoice.subtotal || 0) || items.reduce((sum, item) => {
		return sum + Number(item.qty || item.quantity || 0) * Number(item.price || 0);
	}, 0);

	const gst = Number(invoice.gst || 0);
	const taxAmount = subtotal * (gst / 100);
	const grandTotal = Number(invoice.grandTotal || subtotal + taxAmount);

	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8" />
	<style>
		body {
			font-family: Arial, sans-serif;
			margin: 0;
			padding: 0;
			color: #0f172a;
			background: #f8fafc;
		}

		.page {
			width: 794px;
			min-height: 1123px;
			margin: auto;
			background: white;
			padding: 40px;
			box-sizing: border-box;
		}

		.header {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			border-bottom: 4px solid #2563eb;
			padding-bottom: 20px;
		}

		.brand {
			display: flex;
			gap: 16px;
			align-items: center;
		}

		.logo {
			width: 80px;
			height: 80px;
			border-radius: 18px;
			object-fit: cover;
			background: #dbeafe;
		}

		.company h1 {
			margin: 0;
			font-size: 28px;
			color: #1d4ed8;
		}

		.company p {
			margin: 5px 0;
			color: #475569;
			font-size: 13px;
		}

		.invoice-title {
			text-align: right;
		}

		.invoice-title h2 {
			font-size: 42px;
			color: #2563eb;
			margin: 0;
		}

		.invoice-no {
			background: #0f172a;
			color: white;
			padding: 8px 16px;
			border-radius: 999px;
			display: inline-block;
			margin-top: 10px;
			font-weight: bold;
		}

		.grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 24px;
			margin-top: 35px;
		}

		.card {
			border: 1px solid #dbe3ef;
			border-radius: 14px;
			padding: 20px;
		}

		.card-title {
			background: #2563eb;
			color: white;
			display: inline-block;
			padding: 8px 14px;
			border-radius: 10px;
			font-weight: bold;
			margin-bottom: 16px;
		}

		.row {
			display: flex;
			justify-content: space-between;
			margin: 9px 0;
			font-size: 14px;
		}

		.status {
			background: ${statusColor(invoice.status)};
			color: white;
			padding: 5px 12px;
			border-radius: 999px;
			font-weight: bold;
		}

		table {
			width: 100%;
			border-collapse: collapse;
			margin-top: 35px;
		}

		th {
			background: #2563eb;
			color: white;
			padding: 12px;
			font-size: 13px;
			text-align: left;
		}

		td {
			border: 1px solid #e2e8f0;
			padding: 12px;
			font-size: 13px;
		}

		.text-right {
			text-align: right;
		}

		.total-box {
			width: 330px;
			margin-left: auto;
			margin-top: 25px;
			border: 1px solid #dbe3ef;
			border-radius: 14px;
			overflow: hidden;
		}

		.total-row {
			display: flex;
			justify-content: space-between;
			padding: 12px 16px;
			border-bottom: 1px solid #e2e8f0;
		}

		.grand {
			background: #2563eb;
			color: white;
			font-size: 20px;
			font-weight: bold;
		}

		.footer {
			margin-top: 50px;
			border-top: 2px solid #2563eb;
			padding-top: 18px;
			text-align: center;
			color: #475569;
			font-size: 13px;
		}

		.thanks {
			margin-top: 25px;
			background: #dcfce7;
			color: #166534;
			padding: 14px;
			border-radius: 12px;
			width: 300px;
			font-weight: bold;
		}
	</style>
</head>

<body>
	<div class="page">
		<div class="header">
			<div class="brand">
				${
					settings?.logoUrl
						? `<img class="logo" src="${settings.logoUrl}" />`
						: `<div class="logo"></div>`
				}

				<div class="company">
					<h1>${settings?.businessName || 'InvoicePro'}</h1>
					<p>${settings?.address || 'Business Address'}</p>
					<p>${settings?.phone || 'Phone Number'}</p>
					<p>${settings?.email || ''}</p>
					<p>GST: ${settings?.gstNumber || '-'}</p>
				</div>
			</div>

			<div class="invoice-title">
				<h2>INVOICE</h2>
				<div class="invoice-no"># ${invoice.invoiceNo}</div>
			</div>
		</div>

		<div class="grid">
			<div class="card">
				<div class="card-title">BILL TO</div>
				<h3>${customer?.name || invoice.customerName || 'Customer'}</h3>
				<p>${customer?.email || ''}</p>
				<p>${customer?.phone || ''}</p>
				<p>${customer?.address || ''}</p>
			</div>

			<div class="card">
				<div class="card-title">INVOICE INFO</div>
				<div class="row"><span>Invoice No</span><strong>${invoice.invoiceNo}</strong></div>
				<div class="row"><span>Date</span><strong>${invoice.invoiceDate || invoice.date || '-'}</strong></div>
				<div class="row"><span>Due Date</span><strong>${invoice.dueDate || '-'}</strong></div>
				<div class="row"><span>Status</span><span class="status">${invoice.status || 'Pending'}</span></div>
			</div>
		</div>

		<table>
			<thead>
				<tr>
					<th>#</th>
					<th>Description</th>
					<th>Qty</th>
					<th>Unit Price</th>
					<th class="text-right">Amount</th>
				</tr>
			</thead>
			<tbody>
				${items
					.map((item, index) => {
						const qty = Number(item.qty || item.quantity || 0);
						const total = Number(item.total || qty * Number(item.price || 0));

						return `
							<tr>
								<td>${index + 1}</td>
								<td>${item.product || item.name || item.description || 'Service'}</td>
								<td>${qty}</td>
								<td>${money(item.price)}</td>
								<td class="text-right">${money(total)}</td>
							</tr>
						`;
					})
					.join('')}
			</tbody>
		</table>

		<div class="total-box">
			<div class="total-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
			<div class="total-row"><span>GST (${gst}%)</span><strong>${money(taxAmount)}</strong></div>
			<div class="total-row grand"><span>Total</span><strong>${money(grandTotal)}</strong></div>
		</div>

		<div class="thanks">Thank you for your business with us!</div>

		<div class="footer">
			<strong>${settings?.businessName || 'InvoicePro'}</strong><br/>
			This is a computer generated invoice. No signature is required.
		</div>
	</div>
</body>
</html>
`;
}

module.exports = invoiceTemplate;