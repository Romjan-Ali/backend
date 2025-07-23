import type { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../../utils/catchAsync'
import { AuthServices } from './auth.service'
import { sendResponse } from '../../utils/sendResponse'
import httpStatus from 'http-status-codes'
import { setAuthCookie } from '../../utils/setCookie'
import AppError from '../../errorHelpers/AppError'
import type { JwtPayload } from 'jsonwebtoken'
import { createUserTokens } from '../../utils/userTokens'
import { envVars } from '../../config/env'

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthServices.credentialsLogin(req.body)

  setAuthCookie(res, loginInfo)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Login successful',
    data: loginInfo,
  })
})

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'No refresh token received from cookies'
      )
    }

    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    )

    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'New access token generated successfully',
      data: tokenInfo,
    })
  }
)

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    })
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    })
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User logout successfully',
      data: null,
    })
  }
)

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword
    const oldPassword = req.body.oldPassword
    const decodedToken = req.user

    await AuthServices.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    )

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Password changed successfully',
      data: null,
    })
  }
)

const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : ''
    if (redirectTo.startsWith('/')) {
      redirectTo = redirectTo.slice(1)
    }

    const user = req.user

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }

    const tokenInfo = createUserTokens(user)

    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
  }
)

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController,
}
