import {Request, Response, NextFunction} from 'express'
import { AddNoteParams as AddAttachmentParams} from './notes'
import mongoose from 'mongoose';
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const Attachment = require('../models/attachments')
const Patient = require('../models/patient');
const Log = require('../models/log')
const ExpressError = require('../utils/ExpressError')

interface AttachmentParams{
    attachmentId: string;
}

module.exports.createAttachment = async(req: Request<AddAttachmentParams>,res: Response, next: NextFunction)=>{
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
            new Promise<UploadApiResponse>((resolve, reject)=>{
                const stream = cloudinary.uploader.upload_stream(
                    {
                    folder: "cms-attachments",
                    resource_type: 'auto',
                },
                    (error: UploadApiErrorResponse, result: UploadApiResponse) =>{
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
                uploadedBy: req.user!.id,
                patient: patientId,
        });
        await Log.create({
            patient: patientId,
            performedBy: req.user!.id,
            action: "ATTACHMENT_UPLOADED"
        })


        res.status(201).json({message: 'Attachment added successfully', attachment})
    
}
 
catch (err) {
    next(err)  
}
}

module.exports.getAttachments = async(req: Request<AddAttachmentParams>,res: Response, next: NextFunction)=>{
    const {patientId} = req.params;
    try{
        const attachments = await Attachment.find({ patient: patientId }).populate('uploadedBy')
        res.status(200).json({message: 'Attachments fetched successfully', attachments})

    } catch (err) {
       next(err)
    }

}

module.exports.downloadFile = async(req: Request<AttachmentParams>,res: Response, next: NextFunction)=>{
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
    catch (err) {
    if (err instanceof mongoose.Error.CastError && err.path === "_id") {
            return next(new ExpressError("Invalid ID", 400));
        }
       next(err)
    }
}

module.exports.deleteAttachment = async(req: Request<AttachmentParams>,res:Response, next: NextFunction)=>{
    const {attachmentId} = req.params;
    try{
        const attachment = await Attachment.findById(attachmentId)
        if(!attachment){
            return res.status(404).json({message: 'File not found'})
        }

        await cloudinary.uploader.destroy(attachment.cloudinaryId)

        await Attachment.findByIdAndDelete(attachmentId)
        
        await Log.create({
            patient: attachment.patient,
            performedBy: req.user!.id,
            action: "ATTACHMENT_DELETED"
        })

        
        return res.status(200).json({
            message: "Attachment deleted successfully",
        });
    } catch (err) {
        if (err instanceof mongoose.Error.CastError && err.path === "_id") {
            return next(new ExpressError("Invalid ID", 400));
        }
        next(err)
    }
}