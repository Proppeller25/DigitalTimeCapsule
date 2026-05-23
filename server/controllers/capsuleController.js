const Capsule = require('../models/capsule')
const PairedUsers = require('../models/pairedUsers')
const User = require('../models/user')


const createCapsule = async (req, res) => {
  try {
    const { name, arrivalDate } = req.body;  // arrivalDate is string "YYYY-MM-DD"
    const remoteFileUrl = req.body.fileUrl;

    if (!name || !arrivalDate || (!req.file && !remoteFileUrl)) {
      return res.status(400).json({ success: false, message: 'missing required fields' });
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const owner = req.user.id || req.user?._id || req.body.userId;
    if (!owner) {
      return res.status(401).json({ success: false, message: 'no loggedIn user found' });
    }

    const fileUrl = req.file
      ? (await Capsule.uploadCapsuleFile(req.file)).url
      : remoteFileUrl;

    // ✅ Parse the local date string to a Date object (midnight in local time)
    const [year, month, day] = arrivalDate.split('-');
    const localDate = new Date(year, month - 1, day);  // month is 0-indexed

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

    return res.status(201).json({ success: true, data: capsule });
  } catch (error) {
    console.error('Error creating capsule:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Server error' });
  }
};

module.exports = {createCapsule}
