const mongoose = require('mongoose')

const capsuleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    arrivalDate: {
      type: Date,
      required: true,
    },
    unlockCode: {
      type: Number,
      required: true,
    },
    visibility: {
      type: String,
      enum: ['private', 'paired'],
      default: 'private',
    },
    sharedWithPairs: [
      {
        pair: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'PairedUsers',
          required: true,
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

capsuleSchema.index({ owner: 1, arrivalDate: 1 })
capsuleSchema.index({ visibility: 1, arrivalDate: 1 })

module.exports = mongoose.model('Capsule', capsuleSchema)
