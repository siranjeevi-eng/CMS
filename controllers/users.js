const bcrypt = require('bcrypt');
const User = require('../models/user')
const Doctor = require('../models/doctor')
const jwt = require('jsonwebtoken')


module.exports.registerUser = async(req,res, next)=>{
    try{
        const {name,email,password,role} = req.body;
        const existingUser = await User.findOne({email})
          if (existingUser) {
                return res.status(400).json({message: "User already exists"})
            }
        if (role === "doctor") {

            const doctor = await Doctor.findOne({ email })

            if (!doctor) {
                return res.status(400).json({
                    message: "Doctor not registered by admin"
                })
            }
            try{
                const user = await User.create({
                name: doctor.name,
                email: doctor.email,
                password: password,
                role: role
            })
                doctor.userId = user._id;
                await doctor.save();

                const token = jwt.sign({
                    id: user._id,
                    role: user.role

                },
                    process.env.JWT_Secret,
                    {
                        expiresIn: '1d'
                    }
                )
                res.status(201).json({
                    message: "User created successfully",
                    user,
                    token
                })
            }
            catch(err){
                res.status(500).json({
                    message: "Internal server error",
                    error: err.message
                })
            }
        }
        else{
            try{
                const user = await User.create({
                    name: name,
                    email: email,
                    password: password,
                    role: role
                })
                const token = jwt.sign({
                    id: user._id,
                    role: user.role
                },
                    process.env.JWT_Secret,
                    {
                        expiresIn: '1d'
                    }
                )
                res.status(201).json({
                    message: "User created successfully",
                    user,
                    token
                })
            }
            catch(err){
                res.status(500).json({
                    message: "Internal server error",
                    error: err.message
                })
            }
        }
    }

    catch(err){
        next(err)
    }
    //console.log(req.body) -- it shouldn't show the plain password
}

module.exports.loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email})

        if(!user){
            return res.status(404).json({
            message:"User not found"
          })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({
            message:"Invalid credentials"
          })
        }

      const token =   jwt.sign({
                id: user._id,
                role: user.role

        },
        process.env.JWT_Secret,
        {
            expiresIn: '1d'
        }
    )
        res.json({
            token,
            user:{
                id: user._id,
                name: user.name,
                role: user.role
            }
        })


    }catch(err){
        res.json(err.message)
    }
}

