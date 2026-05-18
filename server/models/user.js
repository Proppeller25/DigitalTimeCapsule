const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
  type: String,
  required: function () {
    return !this.googleId
  },
  select: false
  },
  lockCode: {
    type: Number
  },
  role: {
    type: String,
    enum: ['organizer', 'attendee', 'admin'],
    default: 'attendee',
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationCode: { 
    type: String, 
    select: false 
  },
  codeValidation: { 
    type: Number, 
    select: false 
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  }
},
{
    timestamps: true, // adds createdAt and updatedAt
  }
)

UserSchema.pre('save', async function() {
  if (!this.password || !this.isModified('password')) return  
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('User', UserSchema)