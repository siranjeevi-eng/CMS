const Notes = require('../models/notes')

module.exports.addNote = async(req,res)=>{
    const {content} = req.body;
    const {patientId} = req.params;
        try{
        const note = await Notes.create({ content, patientId, author: req.user.id})
        res.status(201).json({message: 'Note added successfully', note})
       
    }catch(err){
        res.status(500).json({message: 'Internal server error', error: err.message})    
    }
}

module.exports.getNote = async(req,res)=>{
    const {patientId} = req.params;
    try{

        const notes = await Notes.find({ patientId: patientId }).populate('author').sort({createdAt:-1})
        res.status(201).json(notes)
    }
    catch(err){
        res.status(500).json({message:'Internal server error', error:err.message})
    }

} 