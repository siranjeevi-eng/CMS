"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const ExpressError = require('../utils/ExpressError');
const mongoose_1 = __importDefault(require("mongoose"));
module.exports.addDoctor = async (req, res, next) => {
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
        next(err);
    }
};
module.exports.getDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find().sort({ specialization: 1, name: 1 });
        res.status(200).json({
            doctors
        });
    }
    catch (err) {
        next(err);
    }
};
module.exports.showDoctor = async (req, res, next) => {
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
            return next(new ExpressError("Invalid ID", 400));
        }
        next(err);
    }
};
module.exports.editDoctor = async (req, res, next) => {
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
            return next(new ExpressError("Invalid ID", 400));
        }
        next(err);
    }
};
module.exports.deleteDoctor = async (req, res, next) => {
    const { id } = req.params;
    try {
        const doctor = await Doctor.findByIdAndDelete(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.status(200).json({ message: "Doctor removed successfully" });
    }
    catch (err) {
        if (err instanceof mongoose_1.default.Error.CastError && err.path === "_id") {
            return next(new ExpressError("Invalid ID", 400));
        }
        next(err);
    }
};
//# sourceMappingURL=doctor.js.map