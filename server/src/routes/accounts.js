const express = require('express');
const router = express.Router();

const accountsAPI = require('../app/controllers/AccountsAPI');

router.post('/register', accountsAPI.register);
router.post('/exist', accountsAPI.checkExist);

module.exports = router;
