import { Schema, model } from 'mongoose';

const leadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    budget: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      minlength: 20,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Closed'],
      default: 'New',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Store createdAt automatically
  }
);

export const Lead = model('Lead', leadSchema);
