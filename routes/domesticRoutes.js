const express = require('express');

const domesticCtrl = require('../controller/domesticController');
const router = express.Router();

// Routes
router.route('/').get(domesticCtrl.getAllRates);

router
  .route('/:domestic')
  .post(domesticCtrl.refactorInput, domesticCtrl.createAndSend);

module.exports = router;
