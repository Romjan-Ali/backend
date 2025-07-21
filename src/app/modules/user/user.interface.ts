import { Types } from 'mongoose'

export enum IsActive {
  ACITVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUIDE = 'GUIDE',
}

export interface IAuthProvider {
  provider: string
  providerId: string
}

export interface IUser {
  name: string
  email: string
  password?: string
  role?: Role
  phone?: string
  picture?: string
  address?: string
  isDeleted?: string
  isActive?: IsActive
  isVerified?: string
  auths?: IAuthProvider[]
  bookings?: Types.ObjectId[]
  guides?: Types.ObjectId[]
}
