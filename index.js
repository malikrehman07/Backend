const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const connectDB = require('./config/db')
const Auth = require("./routers/auth")
const Compaigns = require("./routers/compaigns")
const Donations = require("./routers/donations")
const Donors = require("./routers/donors")
const Contact = require("./routers/contact")
const { STRIPE_KEY } = process.env

const stripe = require('stripe')(STRIPE_KEY);


const { PORT = 8000 } = process.env
connectDB()

const corsOption = { origin: 'https://givehope-eta.vercel.app' }
app.use(cors(corsOption))
app.use(express.json())

app.use('/auth', Auth)
app.use('/compaigns', Compaigns)
app.use('/', Donations)
app.use('/dashboard', Donors)
app.use("/contact", Contact)

app.post("/create-payment-intent", async (req, res) => {
    const { amount } = req.body
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        })
        res.send({ clientSecret: paymentIntent.client_secret })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

app.get('/', (req, res) => {
    const currentTime = new Date().toISOString()
    res.send(`App is running on Port${PORT} with current time ${currentTime}`)

})
app.listen(PORT, () => {
    console.log(`App is running on the port ${PORT}`)
})