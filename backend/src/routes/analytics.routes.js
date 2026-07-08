const express = require('express');
const verifyToken = require('../middleware/auth.middleware');
const { getAnalytics } = require('../controllers/analytics.controller');

const router = express.Router();

router.get('/', verifyToken, getAnalytics);

module.exports = router;