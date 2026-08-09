"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const PatientSchema = new Schema({
    patientInfo: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        age: {
            type: Number,
            required: true
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    medicalRecord: {
        disease: {
            type: String,
            required: true
        },
        treatment: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['under_treatment', 'recovered', 'discharged'],
            default: 'under_treatment'
        },
        admissionDate: {
            type: Date,
            default: Date.now
        },
        doctorAssigned: {
            type: Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true
        }
    }
}, { timestamps: true });
module.exports = mongoose_1.default.model('Patient', PatientSchema);
//# sourceMappingURL=patient.js.map