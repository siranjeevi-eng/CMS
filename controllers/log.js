const Log = require('../models/log')

module.exports.getLogs = async(req,res)=>{
    const {patientId} = req.params;

    try{
        const log = await Log.find({ patient: patientId }).populate('performedBy')
        res.status(201).json(log)
    }
    
    catch(err){
        res.status(500).json({ message: 'Internal server error', error: err.message })
    }
}