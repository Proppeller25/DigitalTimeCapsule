const mongoose = require('mongoose')
const { type } = require('node:os')

const capsuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  arrivalDate: {
    type: Date,
    required: true
  },
  unlockCode: {
    type: Number,
    required: true
  }  
},
{
  timestamps: true
})