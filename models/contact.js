// models/Contact.js
const mongoose = require("mongoose");
const {Schema, model} = mongoose

const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const Contact = model("contact", schema)

module.exports = Contact
