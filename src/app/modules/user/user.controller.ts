import type { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status-codes'
import { type JwtPayload } from 'jsonwebtoken'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import { UserServices } from './user.service'

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'User Created Successfully',
      data: user,
    })
  }
)
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload

    const verifiedToken = req.user

    const payload = req.body
    const user = await UserServices.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    )

    // res.status(httpStatus.CREATED).json({
    //     message: "User Created Successfully",
    //     user
    // })

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'User Updated Successfully',
      data: user,
    })
  }
)

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const result = await UserServices.getAllUsers(
      query as Record<string, string>
    )

    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'All Users Retrieved Successfully',
      data: result.data,
      meta: result.meta,
    })
  }
)
const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await UserServices.getMe(decodedToken.userId)

    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Your profile Retrieved Successfully',
      data: result.data,
    })
  }
)
const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const result = await UserServices.getSingleUser(id)
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'User Retrieved Successfully',
      data: result.data,
    })
  }
)

// function => try-catch catch => req-res function

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  getMe,
}
