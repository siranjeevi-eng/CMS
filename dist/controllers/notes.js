"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Notes = require('../models/notes');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Log = require('../models/log');
module.exports.addNote = async (req, res) => {
    const { content } = req.body;
    const { patientId } = req.params;
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }
        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }
        if (patient.medicalRecord.doctorAssigned.toString() !== doctor._id.toString()) {
            return res.status(403).json({
                message: "You are not assigned to this patient"
            });
        }
        const note = await Notes.create({ content, patientId, author: req.user.id });
        await Log.create({
            patient: patientId,
            performedBy: req.user.id,
            action: "NOTE_ADDED"
        });
        res.status(201).json({ message: 'Note added successfully', note });
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
module.exports.getNote = async (req, res) => {
    const { patientId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    try {
        const notes = await Notes.find({ patientId: patientId })
            .populate('author')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const totalNotes = await Notes.countDocuments({ patientId: patientId });
        res.status(200).json({
            notes,
            currentPage: page,
            totalPages: Math.ceil(totalNotes / limit),
            totalNotes
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
module.exports.editNote = async (req, res) => {
    const { patientId, noteId } = req.params;
    const { content } = req.body;
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }
        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }
        if (patient.medicalRecord.doctorAssigned.toString() !== doctor._id.toString()) {
            return res.status(403).json({
                message: "You are not assigned to this patient"
            });
        }
        const existingNote = await Notes.findById(noteId);
        if (!existingNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        const note = await Notes.findByIdAndUpdate(noteId, { content }, { new: true });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        if (existingNote.content !== note.content) {
            await Log.create({
                patient: patientId,
                performedBy: req.user.id,
                action: "NOTE_UPDATED",
                oldValue: existingNote.content,
                newValue: note.content
            });
        }
        res.status(200).json({ message: 'Note updated sucessfully', note });
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
//# sourceMappingURL=notes.js.map