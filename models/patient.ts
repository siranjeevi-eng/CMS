import mongoose from 'mongoose';
const Schema = mongoose.Schema;

interface Patient{
    patientInfo:{
        name: string,
        email: string,
        age: number,
        gender: "male" | "female" | "other",
        phone: string
    },
    medicalRecord:{
        disease: string,
        treatment: string,
        status: "under_treatment"| "recovered" | "discharged",
        admissionDate: Date,
        doctorAssigned: mongoose.Types.ObjectId
}
}

const PatientSchema = new Schema <Patient>({
    patientInfo:{
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

    medicalRecord:{
        disease:{
            type: String,
            required: true
        },
        treatment:{
            type: String,
            required: true
        },
        status:{
            type: String,
            enum: ['under_treatment','recovered', 'discharged'],
            default: 'under_treatment'
        },
        admissionDate:{
            type: Date,
            default: Date.now
        },
        doctorAssigned:{
            type: Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true
        }
    }
}, {timestamps: true})

module.exports = mongoose.model('Patient', PatientSchema)