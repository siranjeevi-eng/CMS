const express = require('express')

const router = express.Router({mergeParams: true})
const {addNote, getNote} = require('../controllers/notes')
const {authMiddleware, authorizeRoles, validateNote} = require('../middleware')


router.get('/', authMiddleware, getNote)
router.post('/add', authMiddleware, authorizeRoles('doctor'), validateNote,addNote)

module.exports = router