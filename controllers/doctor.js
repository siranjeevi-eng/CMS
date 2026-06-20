const Doctor = require('../models/doctor')
const Patient = require('../models/patient')


module.exports.addDoctor = async(req,res)=>{
    const {name, email, specialization, experience} = req.body;

    try{
        const existingDoctor = await Doctor.findOne({ email });

        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor already exists' })
        }
        const doctor = await Doctor.create({name,email,specialization,experience})
        res.status(201).json({message: 'Doctor added successfully', doctor})
    }catch(err){
        res.status(500).json({message: 'Internal server error'})
    }
}

module.exports.getDoctors = async(req,res)=>{
    try{
        const doctors = await Doctor.find();
        const totalDoctors = await Doctor.countDocuments();
        const totalPatients = await Patient.countDocuments();

        const startOfToday = new Date();
        startOfToday.setHours(0,0,0,0);

        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setDate(startOfTomorrow.getDate()+1);

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0,0,0,0);


        const startOfNextMonth = new Date(startOfMonth);
        startOfNextMonth.setMonth(startOfNextMonth.getMonth()+1);

        const patientsAddedThisMonth = await Patient.countDocuments({
            createdAt:{
                $gte: startOfMonth,
                $lt: startOfNextMonth
            }
        })

        const patientsAddedToday = await Patient.countDocuments({
            createdAt: {$gte: startOfToday,
            $lt: startOfTomorrow} 
        })
        res.status(200).json({doctors, totalDoctors, totalPatients, patientsAddedToday, patientsAddedThisMonth})
    }catch(err){
        res.status(500).json({message: 'Internal server error'})
    }
}

module.exports.showDoctor = async(req,res)=>{
    try{
        const {id} = req.params;
        const doctor = await Doctor.findById(id);
        if(!doctor){
            return res.status(404).json({message: 'Doctor not found'})
        }
        res.status(200).json({doctor})
    }catch(err){
        if(err.name==="CastError" && err.path === '_id'){
            return res.status(400).json({message: "Invalid ID"})
        }
        res.status(500).json({message: 'Internal server error'})
    }
}


module.exports.editDoctor = async(req,res)=>{
    try{
        const {id} = req.params;
        const {name, email, specialization,experience} = req.body


        const doctor = await Doctor.findByIdAndUpdate(id,{name,email,specialization, experience},{new:true})

        if(!doctor){
            return res.status(404).json({message: "Doctor not found"})
        }

        res.status(200).json({ 
            message: "Doctor details updated successfully",
            doctor
         })

    }catch(err){
        if (err.name === "CastError" && err.path === '_id') {
            return res.status(400).json({ message: "Invalid ID" })
        }
        res.status(500).json({message: "Internal server error"})
    }
}


module.exports.deleteDoctor = async(req,res)=>{
    const {id} = req.params
    try{
        if(!Doctor.findById(id)){
            res.status(404).json({message:"Doctor not dound"})
        }
        await Doctor.findByIdAndDelete(id)
        res.status(200).json({message:"Doctor removed successfully"})
    }catch(err){
        res.status(500).json({message: "Internal server error"})
    }   

}
