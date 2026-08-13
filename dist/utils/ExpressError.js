"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExpressError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.default = ExpressError;
module.exports = ExpressError;
//# sourceMappingURL=ExpressError.js.map