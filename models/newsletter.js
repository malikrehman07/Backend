const mongoose = require("mongoose");
const {Schema, model} = mongoose
const schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);
const Newsletter = model('Newsletter', schema)

module.exports = Newsletter
