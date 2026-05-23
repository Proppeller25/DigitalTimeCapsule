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

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary environment variables are not fully configured')
  }

  const mimeType = file.mimetype || ''
  const isImage = mimeType.startsWith('image/')
  const isVideo = mimeType.startsWith('video/')
  const isLargeFile = file.size >= 8 * 1024 * 1024

  const uploadOptions = {
    folder: 'timeCapsule/capsules',
    resource_type: isImage ? 'image' : isVideo ? 'video' : 'raw',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mp3', 'pdf', 'docx', 'doc'],
    timeout: 120000,
    chunk_size: 6 * 1024 * 1024,
    ...options,
  }

  const result = await new Promise((resolve, reject) => {
    const callback = (error, uploadResult) => {
      if (error) return reject(error)
      return resolve(uploadResult)
    }

    const uploadStream =
      isLargeFile || !isImage
        ? cloudinary.uploader.upload_large_stream(uploadOptions, callback)
        : cloudinary.uploader.upload_stream(uploadOptions, callback)

    uploadStream.on('error', reject)
    uploadStream.on('finish', () => {})
    uploadStream.end(file.buffer)
  })

  if (!result || !result.secure_url) {
    throw new Error('Cloudinary upload did not return a secure URL')
  }

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
