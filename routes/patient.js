const express = require('express')
const router = express.Router()
const { addPatient, editPatient, deletePatient, getPatients, showOnePatient } = require('../controllers/patient')
const { authMiddleware, validatePatient } = require('../middleware')


router.get('/', authMiddleware, getPatients)
router.post('/add', authMiddleware, validatePatient, addPatient)
router.put('/:id/edit', authMiddleware, validatePatient, editPatient)
router.delete('/:id/delete', authMiddleware,deletePatient)
router.get('/:id', authMiddleware,showOnePatient)

module.exports = router