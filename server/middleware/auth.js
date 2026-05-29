const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
  
  try {
    const token = req.signedCookies.Authorization || req.cookies.Authorization || req.header('Authorization')?.replace('Bearer ', '')
  
    if(!token) 
      return res.status(401).json({success: false, message: "No auth credentials"})
  
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET)

    const user = decodedUser.user || decodedUser
    const userId = user.id || user._id

    if(!userId) 
      return res.status(401).json({success: false, message: "No auth(id) credentials"})

    if(user.accountStatus && user.accountStatus !== 'active')
      return res.status(403).json({success: false, message: "account is not active"})

    req.user = {
      id: userId,
      username: user.username,
      email: user.email,
      role: user.role,
      verified: user.verified ?? false,
      accountStatus: user.accountStatus ?? 'active'
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