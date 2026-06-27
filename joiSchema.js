const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML tags!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value });
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.docSchema = Joi.object({
    name: Joi.string().trim().required().escapeHTML(),
    email: Joi.string().email().lowercase().trim().required().escapeHTML(),
    specialization: Joi.string().trim().required().escapeHTML(),
    experience: Joi.number().integer().min(0).required()
}).required().unknown(false);

module.exports.patientSchema = Joi.object({
    patientInfo : Joi.object({
        name: Joi.string().trim().required().escapeHTML(),
        email: Joi.string().email().lowercase().trim().required().escapeHTML(),
        age: Joi.number().integer().min(0).required(),
        gender: Joi.string().trim().required().escapeHTML(),
        phone: Joi.string().trim().required().escapeHTML()
    }).required().unknown(false),
    medicalRecord : Joi.object({
        disease: Joi.string().trim().required().escapeHTML(),
        treatment: Joi.string().trim().required().escapeHTML(),
        admissionDate: Joi.date().required(),
        status: Joi.string().trim().required().escapeHTML(),
        doctorAssigned: Joi.string().trim().required().escapeHTML()
    }).required().unknown(false)
})

module.exports.noteSchema = Joi.object({
    content: Joi.string().trim().min(10).required().escapeHTML()
}).required().unknown(false);