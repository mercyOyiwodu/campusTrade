const Joi = require('joi')

exports.signUpValidation = (req, res, next)=>{
 const schema = Joi.object ({
    fullName: Joi.string()
    .min(3)
    .trim()
    .pattern(/^[A-Za-z ]+$/)
    .required()
    .messages({
        "any.required": 'fullname is required',
        'string.empty': 'fullname cannot be empty',
        'string.pattern.base': 'fullname should only contain alphabets',
        'string.min': 'fullname should not be less than 3 letters'
    }),
    email:Joi.string()
    .email()
    .required()
    .messages({
     "string.email": "invalid email format",
     "any.required": "email is required",
     'string.empty': 'email cannot be empty' 
    }),
    password: Joi.string()
    .min(6)
    .required()
    .messages({
        "string.min": "password must be atleast 6 characters",
        "any.required": "password is required",
        'string.empty': 'password cannot be empty'
    })
 })
 const { error } = schema.validate(req.body, {abortEarly: false})

 if (error) {
    return res.status(400).json({
        message: error.message
    })
 }

 next()
}