const Patient = require('../models/patient')

module.exports.addPatient = async(req,res)=>{
    const { patientInfo, medicalRecord } = req.body;
      

    try{

        const { email } = patientInfo

        const existingPatient = await Patient.findOne({ "patientInfo.email": email })
        if (existingPatient) {
            return res.status(400).json({ message: 'Patient already exists' })
        }
        const patient = await Patient.create({
            patientInfo,
            medicalRecord
        })
        res.status(201).json({ message: 'Patient added successfully', patient })
    }catch(err){
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}

module.exports.getPatients = async(req,res)=>{
    try{
        const patients = await Patient.find()
        res.status(200).json({ patients })
    }
    catch(err){
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}

module.exports.showOnePatient = async(req,res)=>{
    const {id} = req.params;
    try{
        const patient = await Patient.findById(id).populate('medicalRecord.doctorAssigned')
        if(!patient){
           return res.status(404).json({message: "Patient not found"})
        }

        res.status(200).json({message:"Patient found", patient})
    }catch(err){
        if (err.name === "CastError" && err.path === '_id') {
            return res.status(400).json({ message: "Invalid ID" })
        }
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

module.exports.editPatient = async(req,res)=>{
    const {id} = req.params;
    const { patientInfo, medicalRecord } = req.body;
    try{
        const patient = await Patient.findByIdAndUpdate(id, {patientInfo,
             medicalRecord}, {new:true})
        if(!patient){
            return res.status(404).json({ message: "Patient not found"})
        }
        console.log(patient)
        res.status(200).json({ message: "Patient details updated sucessfully", patient })

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error", error: err.message})
        console.log(err.message)
    }
}

module.exports.deletePatient = async(req,res)=>{
    const {id} = req.params;
    
    try{
        if(!Patient.findById(id)){
            return res.status(404).json({ message: "Patient not found"})
        }
        await Patient.findByIdAndDelete(id)
        res.status(200).json({ message: "Patient deleted successfully"})
    }catch(err){
        res.status(500).json({ message: "Internal server error", error: err.message})
    }
}

