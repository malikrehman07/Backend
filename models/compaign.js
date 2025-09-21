const mongoose = require('mongoose')
const { Schema, model } = mongoose
const schema = new Schema({
    uid: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    imageUrls: [{ type: String, required: true }],
}, { timestamps: true })

const Compaigns = model('compaign', schema)

module.exports = Compaigns