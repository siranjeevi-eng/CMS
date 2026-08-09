import mongoose from 'mongoose'
const Schema = mongoose.Schema

interface Doctor{
    name: string,
    email: string,
    specialization: string,
    experience: number,
    userId: mongoose.Types.ObjectId
}

const DoctorSchema = new Schema <Doctor>({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    specialization:{
        type: String,
        required: true
    },
    experience:{
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
})

module.exports = mongoose.model("Doctor", DoctorSchema)