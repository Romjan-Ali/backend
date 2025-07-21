import { model, Schema } from 'mongoose'
import { IsActive, Role, type IUser } from './user.interface'

const authSchema = new Schema(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
)

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACITVE,
    },
    isVerified: { type: Boolean, default: false },
    auths: [authSchema],
  },
  { timestamps: true, versionKey: false }
)

export const User = model<IUser>('User', userSchema)
