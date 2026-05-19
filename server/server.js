const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
require('dotenv').config()
const cors = require('cors')
const mogoose = require('mongoose')
const { default: mongoose } = require('mongoose')
const userRoutes = require('./routes/userRoutes')

const COOKIE_SECRET = process.env.COOKIE_SECRET

if(!COOKIE_SECRET) {
  throw new error("required Env for cookies not set")
}

app.use(cookieParser(COOKIE_SECRET))
const corsOptions = {
  origin: ['http://localhost:5317', 'https://your-frontend.com'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Bearer'],
  credentials: true // Allow cookies and authorization headers
};
const PORT = process.env.PORT || 3000

app.disable('x-powered-by')
app.use(cors(corsOptions))
app.use(express.json())


app.use('/v1', userRoutes)


app.get('/', async (req, res) => {
  res.send("Welcome to the digital time capsule server")
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("database connected")
    if(require.main === module) {
      app.listen(PORT, () => {
        console.log(`server running at http://localhost:${PORT}`)
      })
    }
  })
  .catch((error) => console.log(error.message)) 

