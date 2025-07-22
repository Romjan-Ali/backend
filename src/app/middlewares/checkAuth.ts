import type { NextFunction, Request, Response} from "express";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import type { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
 
export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization
        if(!accessToken) {
            throw new AppError(403, 'No token received')
        }
        const decodedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload
        if(!authRoles.includes(decodedToken.role)){
            throw new AppError(403, 'You are not permitted to view in this route!!')
        }
        req.user = decodedToken
        next()
    } catch (error) {
        console.log('jwt error', error)
        next(error)
    }
}