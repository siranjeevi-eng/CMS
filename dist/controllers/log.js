"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Log = require('../models/log');
module.exports.getLogs = async (req, res, next) => {
    const { patientId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    try {
        const log = await Log.find({ patient: patientId })
            .populate('performedBy')
            .skip((page - 1) * limit)
            .limit(limit);
        const totalLogs = await Log.countDocuments({ patient: patientId });
        res.status(200).json({
            log,
            currentPage: page,
            totalPages: Math.ceil(totalLogs / limit),
            totalLogs
        });
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=log.js.map