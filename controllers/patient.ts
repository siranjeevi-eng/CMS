import { Request, Response } from "express";
import mongoose, { QueryFilter } from "mongoose";
const Patient = require('../models/patient')
const Doctor = require('../models/doctor')
const Log = require('../models/log')
import {LogAction} from '../models/log'

interface PatientBody{
     patientInfo:{
            name: string;
            email: string;
            age: number;
            gender: "male" | "female" | "other";
            phone: string;
        },
        medicalRecord:{
            disease: string;
            treatment: string;
            status: "under_treatment"| "recovered" | "discharged";
            admissionDate: Date;
            doctorAssigned: mongoose.Types.ObjectId;
    }
}

interface PatientParams{
    id: string;
}

interface Query{
    search?: string;
    filter?: string;
    status?: "under_treatment" | "recovered" | "discharged";
    mine?: string;
    page?: string;
    limit?: string;
}

interface LogBody{
    patient: mongoose.Types.ObjectId,
    performedBy: mongoose.Types.ObjectId,
    action: LogAction,
    oldValue?: string,
    newValue?: string
}

module.exports.addPatient = async(req: Request<{},{}, PatientBody>,res: Response)=>{
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
            performedBy: req.user!.id,
            action: "PATIENT_CREATED"

        })
        res.status(201).json({ message: 'Patient added successfully', patient })
    } catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: "Internal server error",
                error: err.message
            })
        }
        return res.status(500).json({
            message: "Something went wrong",
            error: "Unknown error"
        });
    }
}

module.exports.getPatients = async (req: Request<{}, {}, {}, Query>, res: Response)=>{
    try{
        const search = req.query.search || '';
        const filter = req.query.filter || '';
        const status = req.query.status || '';
        const mine = req.query.mine || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;


        const loggedInDoctor = await Doctor.findOne({ userId:req.user!.id});
        const query: mongoose.QueryFilter<PatientBody> = search 
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
    } catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: "Internal server error",
                error: err.message
            })
        }
        return res.status(500).json({
            message: "Something went wrong",
            error: "Unknown error"
        });
    }
}

module.exports.showOnePatient = async(req:Request<PatientParams>,res:Response)=>{
    const {id} = req.params;
    try{
        const patient = await Patient.findById(id).populate('medicalRecord.doctorAssigned')
        if(!patient){
           return res.status(404).json({message: "Patient not found"})
        }

        res.status(200).json({message:"Patient found", patient})
    } catch (err) {
            if (err instanceof mongoose.Error.CastError && err.path === "_id") {
                return res.status(400).json({
                    message: "Invalid ID"
                });
            }
    
            if (err instanceof Error) {
                return res.status(500).json({
                    message: "Internal server error",
                    error: err.message
                });
            }
    
            return res.status(500).json({
                message: "Something went wrong",
                error: "Unknown error"
            });
        }
}

module.exports.editPatient = async(req: Request<PatientParams,{},PatientBody>,res: Response)=>{
    const {id} = req.params;
    const { patientInfo, medicalRecord } = req.body;

    const createLog = (data: Omit<LogBody, "patient" | "performedBy">)=>{
        Log.create({
            patient: id,
            performedBy: req.user!.id,
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

    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: "Internal server error",
                error: err.message
            })
        }
        return res.status(500).json({
            message: "Something went wrong",
            error: "Unknown error"
        });
    }
}

module.exports.deletePatient = async(req: Request<PatientParams>,res: Response)=>{
    const {id} = req.params;
    
    try{
        const patient = await Patient.findByIdAndDelete(id)
        if(!patient){
            return res.status(404).json({ message: "Patient not found"})
        }
        res.status(200).json({ message: "Patient deleted successfully"})
    }catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: "Internal server error",
                error: err.message
            })
        }
        return res.status(500).json({
            message: "Something went wrong",
            error: "Unknown error"
        });
    }
}

