'use strict';

const express = require('express');
const router = express.Router();

/*** routes for this service ***/
router.post('/', require('./filterData.js'));

module.exports = router;
