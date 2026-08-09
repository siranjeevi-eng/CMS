"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const attachmentSchema = new Schema({
    originalName: {
        type: String,
        required: true
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    resourceType: {
        type: String,
        required: true
    },
    format: {
        type: String
    },
    fileSize: {
        type: Number
    },
    mimeType: {
        type: String,
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    }
}, {
    timestamps: true
});
module.exports = mongoose_1.default.model('Attachment', attachmentSchema);
//# sourceMappingURL=attachments.js.map