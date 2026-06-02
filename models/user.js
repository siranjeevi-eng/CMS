const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const UserSchema = new Schema ({
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
        enum: ['admin', 'doctor'],
        default: 'doctor'
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