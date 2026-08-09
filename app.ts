require("dotenv").config()
const express = require('express');
import type { Request, Response, NextFunction } from "express";
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const userRoutes = require('./routes/user')
const doctorRoutes = require('./routes/doctor')
const patientRoutes = require('./routes/patient')
const noteRoutes = require('./routes/notes') 
const attachementRoutes = require('./routes/attachement')  
const logRoute = require('./routes/log')
const ExpressError = require('./utils/ExpressError')

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.URL)

app.use(cors({
    origin:process.env.CLIENT_URL,
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
    mongoSanitize.sanitize(req.body);
    mongoSanitize.sanitize(req.query);
    mongoSanitize.sanitize(req.params);
    next();
});
app.use(helmet())

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        message: "Too many login attempts. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/cms/auth', authLimiter, userRoutes)
app.use('/cms/doctor', apiLimiter, doctorRoutes)
app.use('/cms/patient', apiLimiter, patientRoutes)
app.use('/cms/patient/:patientId/note', apiLimiter, noteRoutes)
app.use('/cms/patient/:patientId/attachment', apiLimiter, attachementRoutes)
app.use('/cms/patient/:patientId', apiLimiter, logRoute)
app.all(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
    next(new ExpressError('Page Not Found', 404));
});


app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    const { statusCode = 500, message = 'Internal Server Error' } = err;
    res.status(statusCode).json({ message });
});

app.listen(PORT, ()=>{
    console.log("Application is up and running")
})