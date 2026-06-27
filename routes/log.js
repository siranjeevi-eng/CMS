const express = require('express')
const router = express.Router({mergeParams: true})
const { getLogs } = require('../controllers/log')
const { authMiddleware } = require('../middleware')

router.get('/logs',authMiddleware, getLogs )

module.exports = router;