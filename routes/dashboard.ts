import express from "express"

const router = express.Router()
const {dashBoard} = require('../controllers/dashboard')
const {authMiddleware} = require('../middleware')

router.get('/', authMiddleware,dashBoard)


module.exports = router;