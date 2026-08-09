"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const mongoose_1 = __importDefault(require("mongoose"));
module.exports.addDoctor = async (req, res) => {
    const { name, email, specialization, experience } = req.body;
    try {
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor already exists' });
        }
        const doctor = await Doctor.create({ name, email, specialization, experience });
        return res.status(201).json({ message: 'Doctor added successfully', doctor });
    }
    catch (err) {
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
};
module.exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().sort({ specialization: 1, name: 1 });
        const totalDoctors = await Doctor.countDocuments();
        const totalPatients = await Patient.countDocuments();
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const startOfNextMonth = new Date(startOfMonth);
        startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);
        const patientsAddedThisMonth = await Patient.countDocuments({
            createdAt: {
                $gte: startOfMonth,
                $lt: startOfNextMonth
            }
        });
        const patientsAddedToday = await Patient.countDocuments({
            createdAt: {
                $gte: startOfToday,
                $lt: startOfTomorrow
            }
        });
        const underTreatmentPatients = await Patient.countDocuments({
            "medicalRecord.status": "under_treatment"
        });
        const recoveredPatients = await Patient.countDocuments({
            "medicalRecord.status": "recovered"
        });
        const dischargedPatients = await Patient.countDocuments({
            "medicalRecord.status": "discharged"
        });
        res.status(200).json({
            doctors,
            totalDoctors,
            totalPatients,
            patientsAddedToday,
            patientsAddedThisMonth,
            underTreatmentPatients,
            recoveredPatients,
            dischargedPatients
        });
    }
    catch (err) {
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
};
module.exports.showDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        const patients = await Patient.find({ "medicalRecord.doctorAssigned": id });
        res.status(200).json({ doctor, patients });
    }
    catch (err) {
        if (err instanceof mongoose_1.default.Error.CastError && err.path === "_id") {
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
};
module.exports.editDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, specialization, experience } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(id, { name, email, specialization, experience }, { new: true });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.status(200).json({
            message: "Doctor details updated successfully",
            doctor
        });
    }
    catch (err) {
        if (err instanceof mongoose_1.default.Error.CastError && err.path === "_id") {
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
};
module.exports.deleteDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await Doctor.findByIdAndDelete(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.status(200).json({ message: "Doctor removed successfully" });
    }
    catch (err) {
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
};
//# sourceMappingURL=doctor.js.map