const mongoose = require('mongoose')

const pairedUsersSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pairKey: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'cancelled', 'blocked'],
      default: 'pending',
    },
    acceptedAt: {
      type: Date,
    },
    shareSettings: {
      autoShareFutureCapsules: {
        type: Boolean,
        default: true,
      },
      allowBacklogSharing: {
        type: Boolean,
        default: false,
      },
    },
    sharedCapsules: [
      {
        capsule: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Capsule',
          required: true,
        },
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        },
        deliveredAt: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

pairedUsersSchema.pre('validate', function(next) {
  if (!this.requester || !this.recipient) return next()

  if (this.requester.toString() === this.recipient.toString()) {
    return next(new Error('Users cannot pair with themselves'))
  }

  const sortedUserIds = [this.requester.toString(), this.recipient.toString()].sort()
  this.pairKey = sortedUserIds.join(':')
  next()
})

pairedUsersSchema.index({ requester: 1, status: 1 })
pairedUsersSchema.index({ recipient: 1, status: 1 })
pairedUsersSchema.index({ 'sharedCapsules.capsule': 1 })

module.exports = mongoose.model('PairedUsers', pairedUsersSchema)
