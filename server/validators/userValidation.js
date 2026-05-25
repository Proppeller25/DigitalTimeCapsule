const Joi = require('joi')
const regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z0-9]{8,}$')

const signUpSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required().min(6).max(60).email({tlds: {allow: ['com', 'net']}}).messages({
    "string.email": "enter a valid email (.com or .net)"
  }),
  password: Joi.string().min(6).required().pattern(regex).messages({
    "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter and one number"
  }),
  lockCode: Joi.string().min(4).max(4).required()
})

const loginSchema = Joi.object ({
  usernameOrEmail: Joi.string().required(),
  password: Joi.string().required()
})

const updateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required().min(6).max(60).email({tlds: {allow: ['com', 'net']}}).messages({
    "string.email": "enter a valid email (.com or .net)"
  }),
  password: Joi.string().min(6).required().pattern(regex).messages({
    "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
  }),
  lockCode: Joi.string().min(4).max(4).required()
})

const acceptCodeSchema = Joi.object({
  email: Joi.string().email().required().min(6).max(60).email({tlds: {allow: ['com', 'net']}}),
  providedCode: Joi.number().required()
})

const resetPasswordSchema = Joi.object({
  code: Joi.number().required(),
  password: Joi.string().min(6).required().pattern(regex).messages({
    "string.pattern.base": "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter and one number"
  })
})

const googleAuthSchema = Joi.object({
  credential: Joi.string().required()
})


module.exports = {signUpSchema, loginSchema, updateSchema, acceptCodeSchema, resetPasswordSchema, googleAuthSchema}