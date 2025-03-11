import mongoose, { Document } from "mongoose";
export interface ContactDocument extends Document {
  name: string;
  phone: string;
  message?: string;
  createdAt: Date;
}

const contactSchema = new mongoose.Schema<ContactDocument>({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Contact = mongoose.model("contacts", contactSchema);
