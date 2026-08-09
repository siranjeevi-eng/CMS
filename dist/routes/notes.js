"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router({ mergeParams: true });
const { addNote, getNote, editNote } = require('../controllers/notes');
const { authMiddleware, authorizeRoles, validateNote } = require('../middleware');
router.get('/', authMiddleware, getNote);
router.post('/add', authMiddleware, authorizeRoles('doctor'), validateNote, addNote);
router.put('/:noteId/edit', authMiddleware, authorizeRoles('doctor'), validateNote, editNote);
module.exports = router;
//# sourceMappingURL=notes.js.map