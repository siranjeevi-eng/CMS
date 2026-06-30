const Log = require('../models/log')

module.exports.getLogs = async(req,res)=>{
    const {patientId} = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    try{
        const log = await Log.find({ patient: patientId })
        .populate('performedBy')
        .skip((page-1)*limit)
        .limit(limit)

        const totalLogs = await Log.countDocuments({patient:patientId})
        res.status(201).json({
            log,
            currentPage: page,
            totalPages: Math.ceil(totalLogs/limit),
            totalLogs
        })
    }
    
    catch(err){
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
}