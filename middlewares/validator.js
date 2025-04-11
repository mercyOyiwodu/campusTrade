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
        
        email: Joi.string().email().pattern(/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/).required().messages({
          "string.email": "Invalid email format",
          "string.empty": "Email cannot be empty",
          "any.required": "Email is required",
          "string.pattern.base":
            "Invalid email. Use a valid Gmail address with at least 6 characters before '@gmail.com' (e.g., johndoe@gmail.com). Only lowercase letters, numbers, and optional dots are allowed."
        }),
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).trim().messages({
          'string.pattern.base': 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character [!@#$%^&*]',
          'any.required': 'Password is required',
          'string.empty': 'Password cannot be empty',
      }).required(),

       confirmPassword: Joi.string().valid(Joi.ref('password')).messages({
          'any.only': 'Passwords do not match',
          'any.required': 'Confirm password is required',
      }).required(),  
  });
 
    const {error} = schema.validate(req.body, {abortEarly: false});
    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }
    next();
  };

  exports.forgetPasswords = (req, res, next)=>{
    const schema = Joi.object().keys({
            email: Joi.string().email().pattern(/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/).required().messages({
                "string.email": "Invalid email format",
                "string.empty": "Email cannot be empty",
                "any.required": "Email is required",
                "string.pattern.base":
                  "Invalid email. Use a valid Gmail address with at least 6 characters before '@gmail.com' (e.g., johndoe@gmail.com). Only lowercase letters, numbers, and optional dots are allowed."
              }),
        
        })
    }  

exports.resetPasswords = (req, res, next)=>{
const schema = Joi.object().keys({
  email: Joi.string().email().pattern(/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/).required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
    "string.pattern.base":
      "Invalid email. Use a valid Gmail address with at least 6 characters before '@gmail.com' (e.g., johndoe@gmail.com). Only lowercase letters, numbers, and optional dots are allowed."
  }),
})

}
