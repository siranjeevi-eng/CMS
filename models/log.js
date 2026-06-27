const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const logSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },

    performedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },

    action:{
        type: String,
        enum: [
            "PATIENT_CREATED",
            "PATIENT_UPDATED",
            "PATIENT_STATUS_UPDATED",

            "DOCTOR_ASSIGNED",
            "DOCTOR_UNASSIGNED",
            "DOCTOR_REASSIGNED",

            "NOTE_ADDED",
            "NOTE_UPDATED",

            "ATTACHMENT_UPLOADED",
            "ATTACHMENT_DELETED"
        ],
        required: true
    },
    oldValue:{
        type: String
    },
    newValue:{
        type: String
    }
},{timestamps: true})

module.exports = mongoose.model('Log', logSchema)