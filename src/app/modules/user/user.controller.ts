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

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id

  const verifiedToken = req.user

  // console.log({id: req.params.id, user: req.user, body: req.body}) 

  const payload = req.body

  const user = await UserServices.updateUser(userId, payload, verifiedToken)

  sendResponse(res, {
    statusCode: httpStatus.ACCEPTED,
    success: true,
    message: 'User updated successfully',
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
  updateUser,
  getAllUser,
}
