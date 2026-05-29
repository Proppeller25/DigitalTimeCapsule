const User = require('../models/user')
const PairedUsers = require('../models/pairedUsers')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Capsule = require('../models/capsule')

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not set')
  }
  return jwt.sign(
    {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        verified: user.verified ?? false,
        accountStatus: user.accountStatus ?? 'active'
      }
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}

const isProduction = () => process.env.NODE_ENV === 'production' || !process.env.NODE_ENV

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
    const tokenExpiryMs = 1000 * 60 * 60

    res.cookie('Authorization', token, {
      httpOnly: true,
      secure: isProduction(),
      sameSite: isProduction() ? 'strict' : 'lax',
      signed: true,
      expires: new Date(Date.now() + tokenExpiryMs)
    })

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token: !isProduction() ? token  : ""
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

const logout = (req, res) => {
  try {
    res.clearCookie('Authorization')
    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    })
  }
}

const requestPair = async (req, res) => {
  try {
    const {
      recipient,
      allowBacklogSharing
    } = req.body

    if(!recipient) 
      return res.status(400).json({success: false, message: "Missing required credentials"})


    const requester = req.user.id?.toString() || req.user._id?.toString()

    if(!requester) 
      return res.status(401).json({success: false, message: "Missing required credentials"})

    if(recipient?.toString() === requester) 
      return res.status(409).json({success: false, message: "You cannot send a pair request to yourself"})
    
    const receiver = await User.findById(recipient)

    if(!receiver) 
      return res.status(404).json({success: false, message: "Recipient does not exist"})
    
    const shareSettings = { allowBacklogSharing }
    const pairKey = [requester, recipient].sort().join('_')

    await PairedUsers.create({
      requester,
      recipient,
      shareSettings,
      pairKey
    })

    
    return res.status(200).json({
      success: true,
      message: `Share request sent to ${receiver?.username}`
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    })
  }
}

const confirmPair = async (req, res) => {
  try {
    const {decision} = req.body
    const {pairId} = req.params

    const recipient = req.user.id?.toString() || req.user._id?.toString()

    if(!recipient || !decision || !pairId) 
      return res.status(400).json({success: false, message: "Missing required parameters"})

    const validDecisions = ['accepted', 'declined', 'cancelled', 'blocked']
    if(!validDecisions.includes(decision))
      return res.status(400).json({success: false, message: "Invalid decision value"})

    const pair = await PairedUsers.findById(pairId)

    if(!pair) 
      return res.status(404).json({success: false, message: "Pair request not found"})

    if(pair.recipient.toString() !== recipient) 
      return res.status(403).json({success: false, message: "Forbidden"})

    if(pair.status === 'accepted') 
      return res.status(409).json({success: false, message: "This pair request has already been accepted"})

    if (decision !== 'accepted') {
      try {
        pair.status = decision
        await pair.save()
        return res.status(200).json({success: true, message: `This pair request status is now ${decision}`})
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || "Server error"
        })
      }
    }

    

    const sharedCapsules = []

    const requester = pair.requester.toString()

    const requesterCapsules = (await Capsule.find({owner: requester, ...(pair.shareSettings.allowBacklogSharing ? {} : {arrivalDate: {$gt: new Date()}})})).map(capsule => ({
      capsule: capsule._id,
      owner: requester,
      sharedAt: Date.now()
    }))

    console.log('Requester Capsules:', requesterCapsules, requester, pair.shareSettings.allowBacklogSharing ? 'all capsules' : 'future capsules only')

    const recipientCapsules = (await Capsule.find({owner: recipient, ...(pair.shareSettings.allowBacklogSharing ? {} : {arrivalDate: {$gt: new Date()}})})).map(capsule => ({
      capsule: capsule._id,
      owner: recipient,
      sharedAt: Date.now()
    }))

    console.log('Recipient Capsules:', recipientCapsules, recipient, pair.shareSettings.allowBacklogSharing ? {$lte: new Date()} : {$gt: new Date()})

    sharedCapsules.push(...requesterCapsules, ...recipientCapsules)

    const updateData = {
      status: decision,
      acceptedAt: decision === 'accepted' ? Date.now() : null,
      sharedCapsules: decision === 'accepted' ? sharedCapsules : []
    }

    const updatedPair = await PairedUsers.findByIdAndUpdate(pairId, updateData, {new: true, runValidators: true})

    const capsuleIds = sharedCapsules.map(sc => sc.capsule)
    const updatedCapsules = capsuleIds.length
      ? await Capsule.updateMany(
          {_id: {$in: capsuleIds}},
          {
            $set: {visibility: 'paired'},
            $addToSet: {sharedWithPairs: {
              pair: updatedPair._id,
              sharedAt: Date.now()
            }}
          }
        )
      : {acknowledged: true, matchedCount: 0, modifiedCount: 0}

    if (!updatedCapsules.acknowledged) {
      return res.status(500).json({
        success: false,
        message: 'Capsule update was not acknowledged by the database.'
      })
    }

    return res.status(200).json({
      success: true,
      message: `Pair request ${decision}`,
      data: {
        pair: updatedPair,
        capsuleUpdate: {
          matchedCount: updatedCapsules.matchedCount,
          modifiedCount: updatedCapsules.modifiedCount
        }
      }
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    })
  }
}

const updateAccount = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id
    const {username, email, password, lockCode} = req.body
    
    if(!username && !email && !password && !lockCode) {
      return res.status(400).json({
        success: false,
        message: "At least one field (username, email, password, lockCode) must be provided for update"
      })
    }

    // Find the user by ID
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    // Update user fields
    user.username = username || user.username
    user.email = email || user.email
    if(email && email !== user.email) user.verified = false
    user.password = password || user.password
    user.lockCode = lockCode || user.lockCode
    
    // Save the updated user
    const updatedUser = await user.save()

    return res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: isProduction ? "" : updatedUser
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    })
  }
}

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id

    const user = await User.findByIdAndDelete(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    })
  }
}
module.exports = {signUp, login, loggedInUser, logout, requestPair, confirmPair, updateAccount, deleteAccount}
