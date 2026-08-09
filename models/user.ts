import mongoose from "mongoose";
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

export enum Role{
    ADMIN = "admin",
    DOCTOR = "doctor"
}

interface User{
    name: string,
    email: string,
    password: string,
    role: Role
}

const UserSchema = new Schema <User> ({
    name:{
        type: String,
        require: true

    },
    email:{
        type: String,
        unique: true,
        require: true
    },
    password:{
        type: String,
        require: true,
    },
    role:{
        type: String,
        enum: Object.values(Role),
        default: Role.DOCTOR
    }
})

UserSchema.pre("save", async function(){
    if(!this.isModified('password'))
    {
        return;
    }
    
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        
       
})

module.exports = mongoose.model('User', UserSchema)