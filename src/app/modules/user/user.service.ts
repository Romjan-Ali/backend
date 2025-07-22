import type { Request, Response } from 'express'
import { User } from './user.model'
import { Role, type IAuthProvider, type IUser } from './user.interface'
import httpStatus from 'http-status-codes'
import AppError from '../../errorHelpers/AppError'
import bcrypt from 'bcryptjs'
import { envVars } from '../../config/env'
import type { JwtPayload } from 'jsonwebtoken'

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload

  const isUserExist = await User.findOne({ email })

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists')
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  )

  const authProvider: IAuthProvider = {
    provider: 'credentials',
    providerId: email as string,
  }

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  })

  return user
}

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const { email, password, ...rest } = payload

  const isUserExist = await User.findById(userId)

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized')
    }
    if (
      decodedToken.role === Role.SUPER_ADMIN ||
      decodedToken.role === Role.ADMIN
    ) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized')
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized')
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      password as string,
      Number(envVars.BCRYPT_SALT_ROUND)
    )
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  })

  return newUpdatedUser
}

const getAllUsers = async () => {
  const users = await User.find({})
  const totalUsers = await User.countDocuments()

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  }
}

export const UserServices = {
  createUser,
  updateUser,
  getAllUsers,
}
