import type { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status-codes'
import { UserServices } from './user.service'
import { sendResponse } from '../../utils/sendResponse'
import { catchAsync } from '../../utils/catchAsync'

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User created successfully',
    data: user,
  })
})

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const users = await UserServices.getAllUsers()

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All users retrieved successfully',
    data: users,
  })
})

export const UserControllers = {
  createUser,
  getAllUser,
}
