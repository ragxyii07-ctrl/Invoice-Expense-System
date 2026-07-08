const { getMonthlyAnalytics } = require('../services/analytics.service');

exports.getAnalytics = async (req, res) => {
	try {
		const data = await getMonthlyAnalytics(req.user.uid);

		res.json({
			success: true,
			data
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};