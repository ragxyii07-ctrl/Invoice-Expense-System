const express = require('express');
const { sendInvoiceEmail } = require('../controllers/email.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/send', verifyToken, sendInvoiceEmail);

module.exports = router;