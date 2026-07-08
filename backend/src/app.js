const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const testRoutes = require('./routes/test.routes');
const customerRoutes = require('./routes/customer.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const expenseRoutes = require('./routes/expense.routes');
const reportRoutes = require('./routes/report.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const emailRoutes = require('./routes/email.routes');
const backupRoutes = require('./routes/backup.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'Invoice and Expense Management API running'
	});
});

app.get('/api/health/firebase', async (req, res) => {
	try {
		const { db } = require('./config/firebase');

		await db.collection('_healthCheck').doc('test').set({
			status: 'ok',
			checkedAt: new Date()
		});

		res.json({
			success: true,
			message: 'Firebase Firestore connected successfully'
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Firebase connection failed',
			error: error.message
		});
	}
});

app.use('/api/test', testRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/analytics', analyticsRoutes);

module.exports = app;