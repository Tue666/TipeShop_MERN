const express = require('express');
const router = express.Router();

// controllers
const resourcesAPI = require('../app/controllers/ResourcesAPI');
// middlewares
const verifyToken = require('../app/middlewares/verifyToken');

router.put('/:_id', verifyToken, resourcesAPI.update);
router.patch('/lock/:_id', verifyToken, resourcesAPI.editLocked);
router.post('/exist', verifyToken, resourcesAPI.checkExist);
router.post('/', verifyToken, resourcesAPI.create);
router.get('/nested', verifyToken, resourcesAPI.findAllWithNested);

module.exports = router;
