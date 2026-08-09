import mongoose from 'mongoose';
const Schema = mongoose.Schema;

interface Note{
    patientId: mongoose.Types.ObjectId,
    author: mongoose.Types.ObjectId,
    content: string
}

const NotesSchema = new Schema <Note>({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        minlength: 10
    }
}, {timestamps: true})

module.exports = mongoose.model('Notes', NotesSchema)