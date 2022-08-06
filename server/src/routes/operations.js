const express = require('express');
const router = express.Router();

// controllers
const operationsAPI = require('../app/controllers/OperationsAPI');

router.patch('/lock/:_id', operationsAPI.editLocked);
router.post('/', operationsAPI.insert);
router.get('/', operationsAPI.findAll);

module.exports = router;
