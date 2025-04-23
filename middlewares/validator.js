const Joi = require('joi');

exports.registerValidation = (req, res, next) => {
    const schema = Joi.object({
      // fullName: Joi.string()
      //   .min(3)
      //   .trim()
      //   .pattern(/^[A-Za-z ]+$/)
      //   .required()
      //   .messages({
      //     "any.required": 'Fullname is required here',
      //     'string.empty': 'Fullname cannot be empty',
      //     'string.pattern.base': "Fullname should only contain alphabets",
      //     "string.min": "Fullname should not be less than 3 letters"
      //   }),
        
        email: Joi.string().email().required().messages({
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
next()
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
next()
}

exports.kycValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email() // Validates general email format
      .required()
      .messages({
        "string.email": "Invalid email format",
        "string.empty": "Email cannot be empty",
        "any.required": "Email is required",
      }),

    jambRegNo: Joi.string()
      .pattern(/^[0-9]{8}[A-Z]{2}$/)
      .required()
      .messages({
        "string.empty": "JAMB number cannot be empty",
        "any.required": "JAMB number is required",
        "string.pattern.base":
          "Invalid JAMB number format. It must be 8 digits followed by 2 uppercase letters (e.g., 12345678AB).",
      }),

    whatsappLink: Joi.string()
      .pattern(/^https:\/\/(wa\.me\/|api\.whatsapp\.com\/send\?phone=)\+?[0-9]{10,15}$/)
      .required()
      .messages({
        "string.empty": "WhatsApp link cannot be empty",
        "any.required": "WhatsApp link is required",
        "string.pattern.base":
          "Invalid WhatsApp link format. Must be a valid WhatsApp URL (e.g., https://wa.me/2348012345678).",
      }),

    phoneNumber: Joi.string()
      .pattern(/^\+234\d{10}$/)
      .required()
      .messages({
        "string.empty": "Phone number cannot be empty",
        "any.required": "Phone number is required",
        "string.pattern.base":
          "Invalid phone number format. Use the format: +234XXXXXXXXXX (e.g., +2348012345678).",
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map(err => err.message);
    return res.status(400).json({
      message: errorMessages
    });
  }

  next();
};