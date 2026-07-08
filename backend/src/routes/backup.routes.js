const express = require('express');
const verifyToken = require('../middleware/auth.middleware');
const {
	exportBackup,
	importBackup
} = require('../controllers/backup.controller');

const router = express.Router();

router.get('/export', verifyToken, exportBackup);
router.post('/import', verifyToken, importBackup);

module.exports = router;