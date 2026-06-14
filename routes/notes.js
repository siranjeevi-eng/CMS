const express = require('express')

const router = express.Router({mergeParams: true})
const {addNote, getNote, editNote} = require('../controllers/notes')
const {authMiddleware, authorizeRoles, validateNote} = require('../middleware')


router.get('/', authMiddleware, getNote)
router.post('/add', authMiddleware, authorizeRoles('doctor'), validateNote,addNote)
router.put('/:noteId/edit', authMiddleware, authorizeRoles('doctor'), validateNote, editNote)

module.exports = router