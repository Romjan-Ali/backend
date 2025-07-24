import bcrypt from 'bcryptjs'
import httpStatus from 'http-status-codes'
import AppError from '../../errorHelpers/AppError'
import { User } from '../user/user.model'
import type { IUser } from '../user/user.interface'
import { envVars } from '../../config/env'
import {
  createNewAccessTokenWithRefreshToken,
  // createUserTokens,
} from '../../utils/userTokens'
import type { JwtPayload } from 'jsonwebtoken'

/*
const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload

  const isUserExist = await User.findOne({ email })

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email does not exist')
  }

  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  )

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect password')
  }

  const userTokens = createUserTokens(isUserExist)

  const { password: pass, ...rest } = isUserExist.toObject()

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  }
}
  */

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  )
  return {
    accessToken: newAccessToken,
  }
}

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId)

  if (!user || !user.password) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'User not found or password missing'
    )
  }

  const isOldPasswordMatched = await bcrypt.compare(
    oldPassword,
    user?.password || ''
  )

  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password doesn't match")
  }

  user.password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  )

  await user.save()

  return user
}

export const AuthServices = {
  // credentialsLogin,
  getNewAccessToken,
  resetPassword,
}
