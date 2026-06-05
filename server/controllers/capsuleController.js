const Capsule = require('../models/capsule')
const PairedUsers = require('../models/pairedUsers')
const User = require('../models/user')


const createCapsule = async (req, res) => {
  try { 
    const { name, arrivalDate } = req.body  // arrivalDate is string "YYYY-MM-DD"
    const remoteFileUrl = req.body.fileUrl

    if (!name || !arrivalDate || (!req.file && !remoteFileUrl)) {
      return res.status(400).json({ success: false, message: 'missing required fields' })
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    const owner = req.user.id || req.user?._id || req.body.userId

    if (!owner) {
      return res.status(401).json({ success: false, message: 'no loggedIn user found' })
    }

    const user = req.user

    if(!user.verified) 
      return res.status(403).json({success: false, message: 'Account not verified'})

    if(!user.hasLockCode) 
      return res.status(403).json({success: false, message: 'Secret LockCode not set'})

    const fileUrl = req.file
      ? (await Capsule.uploadCapsuleFile(req.file)).url
      : remoteFileUrl

    // ✅ Parse the local date string to a Date object (midnight in local time)
    const [year, month, day] = arrivalDate.split('-')
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentDay = new Date().getDay()
    if (Number(year) < currentYear || (Number(year) >= currentYear && month - 1 < currentMonth) || (Number(year) >= currentYear && month - 1 >= currentMonth && day <= currentDay))
      return res.status(400).json({success: false, message: 'Cannot set a date in the past' })
    const localDate = new Date(year, month - 1, day)  // month is 0-indexed

    const foundPairs = await PairedUsers.find({
      $or: [
        { requester: owner, status: 'accepted' },
        { recipient: owner, status: 'accepted' }
      ],
      'shareSettings.autoShareFutureCapsules': true
    })

    const pairIds = foundPairs.map(pair => pair._id)
    const hasAutoSharePairs = pairIds.length > 0

    const capsule = await Capsule.create({
      owner,
      name,
      fileUrl,
      arrivalDate: localDate,  // Store as Date, not string
      visibility: hasAutoSharePairs ? 'paired' : 'private',
      sharedWithPairs: pairIds.map(pairId => ({
        pair: pairId,
        sharedAt: Date.now()
      }))
    })

    if (hasAutoSharePairs) {
      await PairedUsers.updateMany(
        { _id: { $in: pairIds } },
        { $push: { sharedCapsules: { capsule: capsule._id, owner } } }
      )
    }

    return res.status(201).json({ success: true, data: capsule })
  } catch (error) {
    console.error('Error creating capsule:', error)
    return res.status(500).json({ success: false, message: error?.message || 'Server error' })
  }
}

const getCapsules = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ success: false, message: 'Authentication required' })

    const userId = req.user.id || req.user?._id || req.body.userId

    if (!userId)
      return res.status(401).json({ success: false, message: 'no loggedIn user found' })

    const capsules = await Capsule.find({ owner: userId }).sort({ arrivalDate: 1 })
    const sharedCapsules = await PairedUsers.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    }).populate('sharedCapsules.capsule')

    return res.status(200).json({ success: true, data: { capsules, sharedCapsules } })
  } catch (error) {
    console.error('Error fetching capsules:', error)
    return res.status(500).json({ success: false, message: error?.message || 'Server error' })
  }
}

const deleteCapsule = async (req, res) => {
  try {
    if(!req.user) 
      return res.status(401).json({ success: false, message: 'Authentication required' })

    const userId = req.user.id || req.user?._id || req.body.userId
    const capsuleId = req.params.id

    const capsule = await Capsule.findById(capsuleId)
    if (!capsule)
      return res.status(404).json({ success: false, message: 'Capsule not found' })

    if (capsule.owner.toString() !== userId)
      return res.status(403).json({ success: false, message: 'Access denied' })

    if(capsule.arrivalDate > new Date())
      return res.status(400).json({ success: false, message: 'Cannot delete a capsule that has not arrived yet' })

    await Capsule.findByIdAndDelete(capsuleId)
    return res.status(200).json({ success: true, message: 'Capsule deleted successfully' })
    
  } catch (error) {
    console.error('Error deleting capsule:', error)
    return res.status(500).json({ success: false, message: error?.message || 'Server error' })
  }
}

module.exports = {createCapsule, getCapsules, deleteCapsule}
