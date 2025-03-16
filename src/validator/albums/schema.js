const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().required(),
});

const ImageHeadersSchema = Joi.object({
    'content-type': Joi.string().valid('image/jpeg', 'image/png').required(),
    }).unknown();

module.exports = { AlbumPayloadSchema, ImageHeadersSchema };
