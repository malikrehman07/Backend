const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const connectDB = require('./config/db')
const Auth = require("./routers/auth")
const Compaigns = require("./routers/compaigns")
const Donations = require("./routers/donations")
const Donors = require("./routers/donors")
const Profile = require("./routers/profile")


const { PORT = 8000 } = process.env
connectDB()

const corsOption = { origin: 'http://localhost:5173' }
app.use(cors(corsOption))
app.use(express.json())

app.use('/auth', Auth)
app.use('/compaigns', Compaigns)
app.use('/', Donations)
app.use('/dashboard', Donors)
app.use("/dashboard/profile", Profile);

app.get('/', (req, res) => {
    const currentTime = new Date().toISOString()
    res.send(`App is running on Port${PORT} with current time ${currentTime}`)

})
app.listen(PORT, () => {
    console.log(`App is running on the port ${PORT}`)
})