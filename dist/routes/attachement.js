"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router({ mergeParams: true });
const { createAttachment, getAttachments, downloadFile, deleteAttachment } = require('../controllers/attachement');
const upload = require('../config/upload');
const { authMiddleware, authorizeRoles } = require('../middleware');
router.post('/', authMiddleware, upload.single('attachment'), createAttachment);
router.get('/', authMiddleware, getAttachments);
router.get('/:attachmentId/download', authMiddleware, downloadFile);
router.delete('/:attachmentId/delete', authMiddleware, authorizeRoles('doctor'), deleteAttachment);
module.exports = router;
//# sourceMappingURL=attachement.js.map