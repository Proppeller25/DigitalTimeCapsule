const {signUp, login, loggedInUser, logout} = require('../controllers/userController')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

router.post('/auth/signup', signUp)
router.post('/auth/login', login)
router.get('/auth/me', auth, loggedInUser)
router.post('/auth/logout', auth, logout)


module.exports = router