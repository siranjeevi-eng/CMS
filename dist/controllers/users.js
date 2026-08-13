"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
const User = require('../models/user');
const user_1 = require("../models/user");
const Doctor = require('../models/doctor');
const jwt = require('jsonwebtoken');
module.exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        if (role === user_1.Role.DOCTOR) {
            const doctor = await Doctor.findOne({ email });
            if (!doctor) {
                return res.status(400).json({
                    message: "Doctor not registered by admin"
                });
            }
            const user = await User.create({
                name: doctor.name,
                email: doctor.email,
                password,
                role
            });
            doctor.userId = user._id;
            await doctor.save();
            const token = jwt.sign({
                id: user._id,
                role: user.role
            }, process.env.JWT_Secret, {
                expiresIn: "1d"
            });
            return res.status(201).json({
                message: "User created successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            });
        }
        const user = await User.create({
            name,
            email,
            password,
            role
        });
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_Secret, {
            expiresIn: "1d"
        });
        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    }
    catch (err) {
        next(err);
    }
};
module.exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_Secret, {
            expiresIn: '1d'
        });
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=users.js.map