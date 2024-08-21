const express = require('express');
const { getStats } = require('../Controller/statsController');
const router = express.Router();
const requireAuth = require("../Middleware/authMiddleware");

router.use(requireAuth);


router.get('/stats', getStats); 

module.exports = router;
