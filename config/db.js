const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
    await mongoose.connect(`mongodb+srv://MalikRehman001:EQwAFk47CfkJmlto@cluster0.aar1elp.mongodb.net/hackathon`)
        .then(() => {
            console.log("MongoDB Connected Successfully")
        })
        .catch((err) => {
            console.error("MongoDB Not Connected Successfully", err)
        })
}

module.exports = connectDB