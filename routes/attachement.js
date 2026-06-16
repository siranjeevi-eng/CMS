const express = require('express')
const router = express.Router({mergeParams: true})
const { createAttachment, getAttachments, downloadFile } = require('../controllers/attachement')
const upload = require('../config/upload')
const {authMiddleware, authorizeRoles} = require('../middleware')

router.post('/', authMiddleware,  upload.single('attachment'), createAttachment)
router.get('/', authMiddleware, getAttachments)
router.get('/:attachmentId/download', authMiddleware, downloadFile)
module.exports = router;