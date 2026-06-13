const jwt = require('jsonwebtoken')
const { docSchema, patientSchema, noteSchema } = require('./joiSchema')
const ExpressError = require('./utils/ExpressError')

module.exports.authMiddleware = (req,res,next)=>{
   
    const authHeader = req.headers.authorization          
    if(!authHeader){
        return res.status(401).json({message: 'Unauthorized'})  
    }
    const token = authHeader.split(' ')[1]
    
    try{
        const decoded = jwt.verify(token, process.env.JWT_Secret)
        req.user = decoded
        next()
    }catch(err){
        return res.status(401).json({message: 'Unauthorized'})
    }
}

module.exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message: 'Access denied'
            })
        }
        next()
    }
}

module.exports.validateDoc = (req, res, next) => {

    const { error, value } = docSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        return next(new ExpressError(msg, 400));
    }

    req.body = value; 
    next();
};

module.exports.validatePatient = (req, res, next) => {
    const { error, value } = patientSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        return next(new ExpressError(msg, 400));
    }
    req.body = value;
    next();
};

module.exports.validateNote = (req,res,next)=>{
    const {error, value} = noteSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(', ');
        return next (new ExpressError(msg, 400))
    }
    req.body = value;
    next();
}