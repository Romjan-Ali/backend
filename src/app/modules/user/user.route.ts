import { Router } from 'express'
import { UserControllers } from './user.controller'
import { validateRequest } from '../../middlewares/validateRequest'
import { createUserZodSchema, updateUserZodSchema } from './user.validation'
import { checkAuth } from '../../middlewares/checkAuth'
import { Role } from './user.interface'
import { DivisionController } from '../division/division.controller'

const router = Router()

router.post(
  '/register',
  validateRequest(createUserZodSchema),
  UserControllers.createUser
)
router.get(
  '/all-users',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUser
)
router.patch(
  '/:id',
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
)
router.delete(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.deleteDivision
)

export const UserRoutes = router
