const express = require('express');
const router = express.Router();

// controllers
const rolesAPI = require('../app/controllers/RolesAPI');
// middlewares
const verifyToken = require('../app/middlewares/verifyToken');

router.put('/:_id', verifyToken, rolesAPI.update);
router.post('/exist', verifyToken, rolesAPI.checkExist);
router.post('/', verifyToken, rolesAPI.create);
router.get('/', verifyToken, rolesAPI.findAll);

module.exports = router;
