
const express = require('express')

const router = express.Router()
const {addDoctor,getDoctors,showDoctor, editDoctor, deleteDoctor} = require('../controllers/doctor')
const {authMiddleware, validateDoc} = require('../middleware')

router.post('/add', authMiddleware, validateDoc, addDoctor)
router.get('/get', authMiddleware, getDoctors)

router.put('/:id/edit',authMiddleware, validateDoc, editDoctor)
router.delete('/:id/delete', authMiddleware, deleteDoctor)
router.get('/:id', authMiddleware, showDoctor)


module.exports = router;