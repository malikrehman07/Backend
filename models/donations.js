const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const schema = new Schema({
    uid: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    status: { type: String, default: "Completed" },
    amount: { type: Number, required: true },
    paymentIntentId: { type: String, required: true },
}, { timestamps: true });

const Donations = model("donations", schema);
module.exports = Donations;
