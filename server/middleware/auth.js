const jwt = require('jsonwebtoken')

const User = require('../models/user')

const auth = async (req, res, next) => {
  
  try {
    const token = req.signedCookies.Authorization || req.cookies.Authorization || req.header('Authorization')?.replace('Bearer ', '')
  
    if(!token) 
      return res.status(401).json({success: false, message: "No auth credentials"})
  
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET)
  
    const userId = decodedUser.user.id || decodedUser.id || decodedUser.id
  
    if(!userId) 
      return res.status(401).json({success: false, message: "No auth(id) credentials"})
  
    const existingUser = await User.findById(userId)
  
    if(!existingUser) 
      return res.status(401).json({success: false, message: "invalid auth credentials"})

    const isActive = existingUser.accountStatus === 'active'

    if(!isActive) 
      return res.status(403).json({success: false, message: "account is not active"})
  
    req.user = {
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      verified: existingUser.verified
    }
  
    next()
    
  } catch (error) {
    const isAuthError = error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError'

    res.status(isAuthError ? 401 : 500).json({
      success: false,
      message: isAuthError ? 'Invalid or expired auth token' : error.message || 'Server error'
    })
  }
}

module.exports = auth