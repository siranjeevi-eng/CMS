"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { addDoctor, getDoctors, showDoctor, editDoctor, deleteDoctor } = require('../controllers/doctor');
const { authMiddleware, authorizeRoles, validateDoc } = require('../middleware');
router.post('/add', authMiddleware, authorizeRoles('admin'), validateDoc, addDoctor);
router.get('/', authMiddleware, getDoctors);
router.put('/:id/edit', authMiddleware, authorizeRoles('admin'), validateDoc, editDoctor);
router.delete('/:id/delete', authMiddleware, authorizeRoles('admin'), deleteDoctor);
router.get('/:id', authMiddleware, showDoctor);
module.exports = router;
//# sourceMappingURL=doctor.js.map