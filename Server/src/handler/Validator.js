const Joi = require("joi")

const validRegister = Joi.object({
    username: Joi.string().lowercase().required(),
    email: Joi.string().required().lowercase().email({ minDomainSegments:2 }),
    gender: Joi.string().required(),
    password: Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})

const validLogin = Joi.object({
    username: Joi.string().lowercase().required(),
    password: Joi.string().min(6).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')) 
})

module.exports = {validRegister, validLogin}