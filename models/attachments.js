const mongoose = require('mongoose')
const Schema = mongoose.Schema

const attachmentSchema = new Schema({
    originalName: {
        type: String,
        required: true
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    resourceType: {
        type: String, 
        required: true
    },
    format: {
        type: String
    },
    fileSize: {
        type: Number
    },
    mimeType: {
        type: String,
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Attachment', attachmentSchema)