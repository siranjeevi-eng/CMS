const Patient = require('../models/patient')
const Doctor = require('../models/doctor')
const Log = require('../models/log')

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
        await Log.create({
            patient: patient._id,
            performedBy: req.user.id,
            action: "PATIENT_CREATED"

        })
        res.status(201).json({ message: 'Patient added successfully', patient })
    }catch(err){
        res.status(500).json({message: 'Internal server error', error: err.message})
    }
}

module.exports.getPatients = async(req,res)=>{
    try{
        const search = req.query.search || '';
        const filter = req.query.filter || '';
        const status = req.query.status || '';
        const mine = req.query.mine || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;


        const loggedInDoctor = await Doctor.findOne({ userId:req.user.id});
        const query = search 
        ?{  "patientInfo.name": {  $regex: search, $options: "i"}}
        :{};

        if(status){
            query["medicalRecord.status"] = status;
        }
        if(mine){
            query["medicalRecord.doctorAssigned"] = loggedInDoctor._id;
        }

        if (filter === "today") {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            const startOfTomorrow = new Date(startOfToday);
            startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

            query.createdAt = {
                $gte: startOfToday,
                $lt: startOfTomorrow
            };
        }

        if (filter === "month") {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const startOfNextMonth = new Date(startOfMonth);
            startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);

            query.createdAt = {
                $gte: startOfMonth,
                $lt: startOfNextMonth
            };
        }
        const patients = await Patient.find(query)
        .populate('medicalRecord.doctorAssigned')
        .skip((page-1)*limit)
        .limit(limit)
        .sort({createdAt: -1});
        const totalPatients = await Patient.countDocuments(query)

        res.status(200).json({ 
            patients,
            currentPage: page,
            totalPages: Math.ceil(totalPatients/limit),
            totalPatients
        })
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

    const createLog = (data)=>{
        Log.create({
            patient: id,
            performedBy: req.user.id,
            ...data
        })
    }
    try{
        const existingPatient = await Patient.findById(id).populate('medicalRecord.doctorAssigned');
        if (!existingPatient) {
            return res.status(404).json({ message: "Patient not found" })
        }
        const patient = await Patient.findByIdAndUpdate(id, {patientInfo,
             medicalRecord}, {new:true}).populate('medicalRecord.doctorAssigned')

        if (existingPatient.medicalRecord.doctorAssigned._id.toString() !== medicalRecord.doctorAssigned.toString()) {
            await createLog({
                action: "DOCTOR_REASSIGNED",
                oldValue: existingPatient.medicalRecord.doctorAssigned.name,
                newValue: patient.medicalRecord.doctorAssigned.name
            })
        }

        if (
            existingPatient.patientInfo.name !== patientInfo.name ||
            existingPatient.patientInfo.email !== patientInfo.email ||
            existingPatient.patientInfo.phone !== patientInfo.phone ||
            existingPatient.patientInfo.age !== patientInfo.age ||
            existingPatient.patientInfo.gender !== patientInfo.gender
        ) {
            await createLog({
                action: "PATIENT_UPDATED"
            })
        }

        if(existingPatient.medicalRecord.status !== medicalRecord.status){
            await createLog({
                action: "PATIENT_STATUS_UPDATED",
                oldValue: existingPatient.medicalRecord.status,
                newValue: patient.medicalRecord.status
            })
        }
       
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

