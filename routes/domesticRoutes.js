const express = require('express');

const domesticController = require('../controller/domesticController');
const router = express.Router();

// Params
router.param('domestic', domesticController.refactorInput);

// Routes
router.route('/').get(domesticController.getAllRates);

router.route('/:domestic').post(domesticController.createAndSend);

module.exports = router;
