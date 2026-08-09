import mongoose from 'mongoose'
const Schema = mongoose.Schema

interface Attachment{
    originalName: string,
    cloudinaryId: string,
    url: string,
    resourceType: string,
    format: string,
    fileSize: number,
    mimeType: string,
    uploadedBy: mongoose.Types.ObjectId,
    patient: mongoose.Types.ObjectId
}

const attachmentSchema = new Schema <Attachment>({
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