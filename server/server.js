const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
require('dotenv').config()
const cors = require('cors')
const mogoose = require('mongoose')
const { default: mongoose } = require('mongoose')

app.use(cookieParser())
const corsOptions = {
  origin: ['http://localhost:5317', 'https://your-frontend.com'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Bearer'],
  credentials: true // Allow cookies and authorization headers
};

app.disable('x-powered-by')
app.use(cors(corsOptions))

const PORT = process.env.PORT || 3000

app.get('/', async (req, res) => {
  res.send("Welcome to the digital time capsule server")
})

app.listen(PORT, () => {
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("database connected")
    console.log(`server running at http://localhost:${PORT}`)
  })
  .catch((error) => console.log(error.message)) 
})