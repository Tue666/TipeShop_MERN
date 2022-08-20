const express = require('express');
const router = express.Router();

// controllers
const resourcesAPI = require('../app/controllers/ResourcesAPI');

router.patch('/lock/:_id', resourcesAPI.editLocked);
router.post('/exist', resourcesAPI.checkExist);
router.post('/', resourcesAPI.insert);
router.get('/nested', resourcesAPI.findAllWithNested);

module.exports = router;
