import {Request, Response, NextFunction} from 'express'
import Joi from "joi";
const jwt = require('jsonwebtoken')
const { docSchema, patientSchema, noteSchema } = require('./joiSchema')
const ExpressError = require('./utils/ExpressError')
import { Role } from './models/user'

module.exports.authMiddleware = (req: Request,res: Response,next: NextFunction)=>{
   
    const authHeader = req.headers.authorization          
    if(!authHeader){
        return res.status(401).json({message: 'Unauthorized'})  
    }
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_Secret)
        req.user = decoded
        next()
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: "Internal server error",
                error: err.message
            })
        }
        return res.status(500).json({
            message: "Something went wrong",
            error: "Unknown error"
        });
    }
}

module.exports.authorizeRoles = (...roles: Role[])=>{
    return (req: Request,res: Response,next: NextFunction)=>{
        if(!roles.includes(req.user!.role)){
            return res.status(403).json({
                message: 'Access denied'
            })
        }
        next()
    }
}

module.exports.validateDoc = (req: Request, res: Response, next: NextFunction) => {

    const { error, value } = docSchema.validate(req.body);

    if (error) {
        const msg = error.details.map((el: Joi.ValidationErrorItem )=> el.message).join(', ');
        return next(new ExpressError(msg, 400));
    }

    req.body = value; 
    next();
};

module.exports.validatePatient = (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = patientSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el: Joi.ValidationErrorItem) => el.message).join(', ');
        return next(new ExpressError(msg, 400));
    }
    req.body = value;
    next();
};

module.exports.validateNote = (req: Request,res: Response,next: NextFunction)=>{
    const {error, value} = noteSchema.validate(req.body);

    if(error){
        const msg = error.details.map((el: Joi.ValidationErrorItem) => el.message).join(', ');
        return next (new ExpressError(msg, 400))
    }
    req.body = value;
    next();
}