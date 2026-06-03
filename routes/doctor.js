
const express = require('express')

const router = express.Router()
const {addDoctor,getDoctors,showDoctor, editDoctor, deleteDoctor} = require('../controllers/doctor')
const {authMiddleware, authorizeRoles, validateDoc} = require('../middleware')

router.post('/add', authMiddleware, authorizeRoles('admin'), validateDoc, addDoctor)
router.get('/get', authMiddleware, getDoctors)

router.put('/:id/edit',authMiddleware, authorizeRoles('admin'), validateDoc, editDoctor)
router.delete('/:id/delete', authMiddleware, authorizeRoles('admin'), deleteDoctor)
router.get('/:id', authMiddleware, showDoctor)


module.exports = router;