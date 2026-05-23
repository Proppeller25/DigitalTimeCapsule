const mongoose = require('mongoose')
const cloudinary = require('../config/cloudinary')

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

capsuleSchema.statics.uploadCapsuleFile = async function (file, options = {}) {
  if (!file || !file.buffer) {
    throw new Error('No image file provided')
  }

  const uploadOptions = {
    folder: 'eventure/events',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mp3', 'pdf', 'docx', 'doc'],
    ...options,
  }

  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, uploadResult) => {
        if (error) reject(error)
        else resolve(uploadResult)
      }
    )

    uploadStream.end(file.buffer)
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  }
}

// capsuleSchema.virtual('pairedUser', {
//   ref: 'Booking',
//   localField: '_id',
//   foreignField: 'eventId',
//   justOne: false
// })

// eventSchema.set('toJSON', { virtuals: true });
// eventSchema.set('toObject', { virtuals: true });


module.exports = mongoose.model('Capsule', capsuleSchema)
