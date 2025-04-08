const Joi = require('joi');

exports.registerValidation = (req, res, next) => {
  console.log(req)
    const schema = Joi.object({
      fullName: Joi.string()
        .min(3)
        .trim()
        .pattern(/^[A-Za-z ]+$/)
        .required()
        .messages({
          "any.required": 'Fullname is required here',
          'string.empty': 'Fullname cannot be empty',
          'string.pattern.base': "Fullname should only contain alphabets",
          "string.min": "Fullname should not be less than 3 letters"
        }),
        
      email: Joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
        'string.empty': 'Email cannot be empty'
      }),
        
      password: Joi.string().pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
        "any.required": "Password is required",
        'string.empty': 'Password cannot be empty'
      })
    });
    
    const {error} = schema.validate(req.body, {abortEarly: false});
    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }
    next();
  };