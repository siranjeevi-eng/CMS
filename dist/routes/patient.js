"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { addPatient, editPatient, deletePatient, getPatients, showOnePatient } = require('../controllers/patient');
const { authMiddleware, authorizeRoles, validatePatient } = require('../middleware');
router.get('/', authMiddleware, getPatients);
router.post('/add', authMiddleware, validatePatient, addPatient);
router.put('/:id/edit', authMiddleware, validatePatient, editPatient);
router.delete('/:id/delete', authMiddleware, authorizeRoles('admin'), deletePatient);
router.get('/:id', authMiddleware, showOnePatient);
module.exports = router;
//# sourceMappingURL=patient.js.map