const { getDashboardSummary } = require('../services/dashboard.service');

exports.getDashboard = async (req, res) => {
	try {
		const report = await getDashboardSummary(req.user.uid);

		res.json({
			success: true,
			report
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};