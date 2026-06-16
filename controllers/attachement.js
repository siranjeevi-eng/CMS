const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const Attachment = require('../models/attachments')
const Patient = require('../models/patient');

module.exports.createAttachment = async(req,res)=>{
    const {patientId} = req.params;
try{
    const patient = await Patient.findById(patientId);
    if(!patient){
        return res.status(404).json({message:'Patient does not exist'})
    }

    if(!req.file){
        return res.status(400).json({message:'File is required'})
    }

    
        const uploadStream = ()=> 
            new Promise((resolve, reject)=>{
                const stream = cloudinary.uploader.upload_stream(
                    {
                    folder: "cms-attachments",
                    resource_type: 'auto',
                },
                (error, result) =>{
                    if(error) return reject(error);
                    resolve(result);
                }
            );

                streamifier.createReadStream(req.file.buffer).pipe(stream)
            });
            
            const result = await uploadStream();

            const attachment = await Attachment.create({
                originalName: req.file.originalname,
                cloudinaryId: result.public_id,
                url: result.secure_url,
                resourceType: result.resource_type,
                format: result.format,
                mimeType: req.file.mimetype,
                fileSize: req.file.size,
                uploadedBy: req.user.id,
                patient: patientId,
        });

        res.status(201).json({message: 'Attachment added successfully', attachment})
    
}
 

    catch(err){
        res.status(500).json({message: 'Internal server error'})
       
    }

}

module.exports.getAttachments = async(req,res)=>{
    const {patientId} = req.params;
    try{
        const attachments = await Attachment.find({ patient: patientId }).populate('uploadedBy')
        if(!attachments){
            return res.status(404).json({message: 'Attachment not found'})
        }

        res.status(200).json({message: 'Attachments fetched successfully', attachments})

    }catch(err){
        res.status(500).json({ message: 'Internal server error' })
    }

}

module.exports.downloadFile = async(req,res)=>{
    const {attachmentId} = req.params;

    try{
        const attachment = await Attachment.findById(attachmentId);
        if(!attachment){
          return res.status(404).json({message:'File not found'})
        }

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

        const downloadUrl = `https://res.cloudinary.com/${cloudName}/${attachment.resourceType}/upload/fl_attachment/${attachment.cloudinaryId}`

        res.status(200).json({downloadUrl})
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: 'Internal server error' })
    }
}