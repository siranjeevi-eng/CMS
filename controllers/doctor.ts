import { Request, Response, NextFunction } from "express";
const Doctor = require('../models/doctor')
const Patient = require('../models/patient')
const ExpressError = require('../utils/ExpressError')
import mongoose from "mongoose";

interface AddDoctorBody{
    name: string;
    email:string;
    specialization: string;
    experience: number;
}

interface DoctorParams{
    id: string;
}

module.exports.addDoctor = async(req:Request<{},{}, AddDoctorBody>,res:Response, next: NextFunction)=>{
    const {name, email, specialization, experience} = req.body;

    try{
        const existingDoctor = await Doctor.findOne({ email });

        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor already exists' })
        }
        const doctor = await Doctor.create({name,email,specialization,experience})
        return res.status(201).json({message: 'Doctor added successfully', doctor})
    }
    catch (err) {
        next(err)    
    }
}

module.exports.getDoctors = async(req:Request,res:Response, next: NextFunction)=>{
    try{
        const doctors = await Doctor.find().sort({specialization: 1, name: 1});
        
        res.status(200).json({
            doctors})
    }
    catch (err) {
        next(err)
    }
}

module.exports.showDoctor = async(req:Request<DoctorParams>,res:Response, next: NextFunction)=>{
    try{
        const {id} = req.params;
        const doctor = await Doctor.findById(id);
        if(!doctor){
            return res.status(404).json({message: 'Doctor not found'})
        }

        const patients = await Patient.find({ "medicalRecord.doctorAssigned": id });
        res.status(200).json({doctor, patients})
    }

    catch (err) {
        if (err instanceof mongoose.Error.CastError && err.path === "_id") {
            return next(new ExpressError("Invalid ID", 400));
        }

       next(err);
}
}


module.exports.editDoctor = async(req:Request<DoctorParams, {}, AddDoctorBody>,res:Response, next: NextFunction)=>{
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

    }

    catch (err) {
        if (err instanceof mongoose.Error.CastError && err.path === "_id") {
            return next(new ExpressError("Invalid ID", 400));
        }

        next(err)
    }
}


module.exports.deleteDoctor = async (req: Request<DoctorParams>, res: Response, next:NextFunction) => {
    const { id } = req.params
    try {
        const doctor = await Doctor.findByIdAndDelete(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" })
        }
        res.status(200).json({ message: "Doctor removed successfully" })
    }
    catch (err) {
        if (err instanceof mongoose.Error.CastError && err.path === "_id") {
            return next(new ExpressError("Invalid ID", 400));
        }
        next(err);
    }

}
