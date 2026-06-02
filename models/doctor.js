const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DoctorSchema = new Schema({
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