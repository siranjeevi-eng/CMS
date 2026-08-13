"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const jwt = require('jsonwebtoken');
const { docSchema, patientSchema, noteSchema } = require('./joiSchema');
const ExpressError_1 = __importDefault(require("./utils/ExpressError"));
module.exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_Secret);
        req.user = decoded;
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: "Internal server error",
                error: err.message
            });
        }
        return res.status(500).json({
            message: "Something went wrong",
            error: "Unknown error"
        });
    }
};
const errorHandler = (err, req, res, next) => {
    if (err instanceof ExpressError_1.default) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }
    return res.status(500).json({
        message: "Internal server error",
        error: err.message
    });
};
exports.errorHandler = errorHandler;
module.exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }
        next();
    };
};
module.exports.validateDoc = (req, res, next) => {
    const { error, value } = docSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(', ');
        return next(new ExpressError_1.default(msg, 400));
    }
    req.body = value;
    next();
};
module.exports.validatePatient = (req, res, next) => {
    const { error, value } = patientSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(', ');
        return next(new ExpressError_1.default(msg, 400));
    }
    req.body = value;
    next();
};
module.exports.validateNote = (req, res, next) => {
    const { error, value } = noteSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(', ');
        return next(new ExpressError_1.default(msg, 400));
    }
    req.body = value;
    next();
};
//# sourceMappingURL=middleware.js.map