import mongoose from "mongoose";


const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Contact = mongoose.model('contacts', contactSchema);