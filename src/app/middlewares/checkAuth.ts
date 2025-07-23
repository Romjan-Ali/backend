import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/jwt'
import { envVars } from '../config/env'
import type { JwtPayload } from 'jsonwebtoken'
import AppError from '../errorHelpers/AppError'
import { User } from '../modules/user/user.model'
import httpStatus from '../utils/httpStatus'
import { IsActive } from '../modules/user/user.interface'

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken
      // console.log('accessToken', accessToken)

      if (!accessToken) {
        throw new AppError(403, 'No token received')
      }

      const decodedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload

      
      const isUserExist = await User.findOne({ email: decodedToken.email })      
      
      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist")
      }

      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        )
      }

      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User is deleted')
      }

      if (!authRoles.includes(decodedToken.role)) {
        throw new AppError(403, 'You are not permitted to view in this route!!')
      }

      req.user = decodedToken

      next()
    } catch (error) {
      console.log('jwt error', error)
      next(error)
    }
  }
