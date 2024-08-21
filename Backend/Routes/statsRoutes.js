const express = require('express');
const { getStats } = require('../Controller/statsController');
const router = express.Router();

router.get('/stats', getStats); 

module.exports = router;
