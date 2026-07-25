import { Schema, model } from 'mongoose';

export interface IAdminSchema extends Schema {
  email: string;
  passwordHash: string; // We can use password or passwordHash
}

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Admin = model('Admin', adminSchema);
