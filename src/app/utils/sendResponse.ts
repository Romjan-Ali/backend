import type { Response } from 'express'

interface TMeta {
  total: number
}

interface TResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
  meta?: TMeta
}

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const { statusCode, success, message, meta } = data
  const resData = data
  res.status(data.statusCode).json({
    statusCode,
    success,
    message,
    data: resData.data,
    meta,
  })
}
