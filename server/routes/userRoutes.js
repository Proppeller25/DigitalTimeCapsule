const {signUp, login, loggedInUser, logout, updateAccount, deleteAccount} = require('../controllers/userController')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const validate = require('../middleware/validate')
const {signUpSchema, loginSchema, updateSchema} = require('../validators/userValidation')

router.post('/auth/signup', validate(signUpSchema), signUp)
router.post('/auth/login', validate(loginSchema), login)
router.get('/auth/me', auth, loggedInUser)
router.post('/auth/logout', auth, logout)
router.patch('/auth/update', auth, updateAccount)
router.delete('/auth/delete', auth, deleteAccount)


module.exports = router