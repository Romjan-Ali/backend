import { Router, type NextFunction, type Request, type Response } from 'express'
import { AuthControllers } from './auth.controller'
import { checkAuth } from '../../middlewares/checkAuth'
import { Role } from '../user/user.interface'
import passport from 'passport'

const router = Router()

router.post('/login', AuthControllers.credentialsLogin)
router.post('/refresh-token', AuthControllers.getNewAccessToken)
router.post('/logout', AuthControllers.logout)
router.post(
  '/reset-password',
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
)

// google auth

router.get(
  '/google',
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || '/'
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: redirect as string,
    })(req, res, next)
  }
)

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  AuthControllers.googleCallbackController
)

export const AuthRoutes = router
