const User = require('../models/user')
const PairedUsers = require('../models/pairedUsers')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not set')
  }
  return jwt.sign(
    { user: { id: user._id, username: user.username, email: user.email, role: user.role} },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}

const isProduction = process.env.ENVIRONMENT && process.env.ENVIRONMENT === 'production'

const signUp = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      lockCode,
    } = req.body

    if (!username || !email || !password || !lockCode) 
      return res.status(400).json({success: false, message: "insufficient credentials"})

    const existingUser = await User.findOne({
      $or: [{email}, {username}]
    })

    if(existingUser)
      return res.status(409).json({success: false, message: "Username or email already used"})

    const details = {
      username,
      email,
      password,
      lockCode
    }

    const newUser = await new User(details)

    await newUser.save()

    res.status(201).json({
      success: true
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    })
  }
}

const login = async (req, res) => {
  try {
    const {
      usernameOrEmail,
      password
    } = req.body

    if((!usernameOrEmail || typeof usernameOrEmail !== 'string') || !password)
      return res.status(400).json({success: false, message: "Missing required credentials"})

    const existingUser = await User.findOne({$or: [{username: usernameOrEmail}, {email: usernameOrEmail}]}).select('+password')

    if(!existingUser) 
      return res.status(401).json({success: false, message: "Invalid user credentials"})

    const isMatch = await bcrypt.compare(password, existingUser.password)

    if(!isMatch)
      return res.status(401).json({success: false, message: "Invalid password credentials"})

    const token = createToken(existingUser)

    res.cookie('Authorization', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      signed: true,
      expires: new Date(Date.now() + 9000000)
    })

    return res.status(200).json({
      success: true,
      message: "Logged in successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "server error"
    })
  }
}

const loggedInUser = async (req, res) => {
  try {
    const user = req.user
    if(!user) 
      return res.status(401).json({success: false, message: "auth credentials required"})
     res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        verified: user.verified
      }
     })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    })
  }
}

module.exports = {signUp, login, loggedInUser}