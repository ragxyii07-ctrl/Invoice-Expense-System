const { auth } = require('../config/firebase');

async function verifyToken(req, res, next) {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return res.status(401).json({
				success: false,
				message: 'Token missing'
			});
		}

		const token = authHeader.replace('Bearer ', '');

		const decoded = await auth.verifyIdToken(token);

		req.user = decoded;

		next();
	} catch (error) {
		res.status(401).json({
			success: false,
			message: 'Invalid token'
		});
	}
}

module.exports = verifyToken;