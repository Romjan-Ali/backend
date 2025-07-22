import bcrypt from 'bcryptjs'
import httpStatus from 'http-status-codes'
import AppError from '../../errorHelpers/AppError'
import { User } from '../user/user.model'
import type { IUser } from '../user/user.interface'
import { envVars } from '../../config/env'
import { generateToken } from '../../utils/jwt'

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload

  const isUserExist = await User.findOne({ email })

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email does not exist')
  }

  const isPasswordMatched = bcrypt.compare(
    password as string,
    isUserExist.password as string
  )

  if(!isPasswordMatched){
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password')
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  }

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  )

  return { accessToken }
}

export const AuthServices = {
    credentialsLogin
}