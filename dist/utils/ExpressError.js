"use strict";
class ExpressError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
module.exports = ExpressError;
//# sourceMappingURL=ExpressError.js.map