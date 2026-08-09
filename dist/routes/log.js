"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router({ mergeParams: true });
const { getLogs } = require('../controllers/log');
const { authMiddleware } = require('../middleware');
router.get('/logs', authMiddleware, getLogs);
module.exports = router;
//# sourceMappingURL=log.js.map