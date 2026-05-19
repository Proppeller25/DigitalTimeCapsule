const {signUp, login, loggedInUser} = require('../controllers/userController')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

router.post('/auth/signup', signUp)
router.post('/auth/login', login)
router.get('/auth/me', auth, loggedInUser)


module.exports = router