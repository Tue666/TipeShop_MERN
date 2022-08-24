const express = require('express');
const router = express.Router();

// controllers
const rolesAPI = require('../app/controllers/RolesAPI');

router.post('/exist', rolesAPI.checkExist);
router.post('/', rolesAPI.insert);
router.get('/', rolesAPI.findAll);

module.exports = router;
