const express = require('express')
const router = express.Router()
const Users = require('../models/auth')
const bcrypt = require('bcrypt')
require('dotenv').config()
const { getRandomId } = require("../config/global")
const { verifyToken } = require("../middleware/auth")
const jwt = require("jsonwebtoken")


const { JWT_SECRET_KEY } = process.env
console.log('JWT_SECRET_KEY', JWT_SECRET_KEY)

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body
        const user = await Users.findOne({ email })
        if (user) { res.status(401).json({ message: 'Email already in use', isError: true }) }
        console.log('user found', user)
        const hashedPassword = await bcrypt.hash(password, 10)
        const uid = getRandomId()

        const userData = { uid, firstName, lastName, email, password: hashedPassword, role }

        const newUser = new Users(userData)
        await newUser.save()
        const token = jwt.sign({ uid }, JWT_SECRET_KEY, { expiresIn: '1d' })
        res.status(201).json({ message: "User Registered Successfully", isError: false, user: newUser, token })

    } catch (err) {
        console.error("Registeration Error ", err)
        res.status(500).json({ message: "Something went wrong while registering the user", isError: true, error: err.message })
    }
})
router.post('/login', async (req, res) => {
    try {
        const { email, password, } = req.body
        const user = await Users.findOne({ email })
        if (!user) { res.status(401).json({ message: 'Email is not registered', isError: true }) }
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            const token = jwt.sign({ uid: user.uid }, JWT_SECRET_KEY, { expiresIn: '1d' })
            res.status(201).json({ message: "User Logged In Successfully", isError: false, token })
        } else { res.status(401).json({ message: 'Email or Password us Incorrect', isError: true }) }

    } catch (err) {
        console.error("Logged In Error ", err)
        res.status(500).json({ message: "Something went wrong while Logging In the user", isError: true, error: err.message })
    }
})
router.get("/user", verifyToken, async (req, res) => {
    try {
        const { uid } = req
        const user = await Users.findOne({ uid }).select("-password")
        if (!user) { return res.status(401).json({ message: "User not found", isError: true }) }
        res.status(200).json({ message: "User Found", isError: false, user })
    } catch {
        res.status(500).json({ message: "something went wrong while fetching the user", isError: true })
    }
})
module.exports = router