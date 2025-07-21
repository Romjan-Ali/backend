import type { NextFunction, Request, Response } from 'express'

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>

export const catchAsync =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
      // console.log('error', err)
      // console.log('error.stack', err.stack)
      next(err)
    })
  }
