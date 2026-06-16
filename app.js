require("dotenv").config()
const express = require('express')
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser')
const userRoutes = require('./routes/user')
const doctorRoutes = require('./routes/doctor')
const patientRoutes = require('./routes/patient')
const noteRoutes = require('./routes/notes') 
const attachementRoutes = require('./routes/attachement')  
const ExpressError = require('./utils/ExpressError')



mongoose.connect(process.env.URL)

app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/cms/auth', userRoutes)
app.use('/cms/doctor', doctorRoutes)
app.use('/cms/patient', patientRoutes)
app.use('/cms/patient/:patientId/note', noteRoutes)
app.use('/cms/patient/:patientId/attachment', attachementRoutes)
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});


app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Internal Server Error' } = err;
    res.status(statusCode).json({ message });
});

app.listen(4000, ()=>{
    console.log("Application is up and running")
})