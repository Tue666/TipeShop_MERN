const express = require('express');
const router = express.Router();

// controllers
const operationsAPI = require('../app/controllers/OperationsAPI');
// middlewares
const verifyToken = require('../app/middlewares/verifyToken');

router.delete('/destroy/:_id', verifyToken, operationsAPI.destroy);
router.delete('/:_id', verifyToken, operationsAPI.delete);
router.put('/:_id', verifyToken, operationsAPI.update);
router.patch('/lock/:_id', verifyToken, operationsAPI.editLocked);
router.patch('/restore/:_id', verifyToken, operationsAPI.restore);
router.post('/exist', verifyToken, operationsAPI.checkExist);
router.post('/', verifyToken, operationsAPI.create);
router.get('/deleted', verifyToken, operationsAPI.findAllDeleted);
router.get('/', verifyToken, operationsAPI.findAll);

module.exports = router;
