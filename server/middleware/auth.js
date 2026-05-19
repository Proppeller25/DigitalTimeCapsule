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


  
    req.user = {
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      verified: existingUser.verified
    }
  
    next()
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    })
  }
}

module.exports = auth