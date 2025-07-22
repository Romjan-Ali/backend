import z from 'zod'
import { IsActive, Role } from './user.interface'

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Name must be string.' })
    .min(3, { message: 'Name must be at least 2 characters long.' })
    .max(50, { message: 'Name must be at most 50 characters long.' }),
  email: z
    .string({ invalid_type_error: 'Email must be string.' })
    .email({ message: 'Invalid email address.' })
    .min(3, { message: 'Email must be at least 2 characters long.' })
    .max(100, { message: 'Email cannot exceed 50 characters.' }),
  password: z
    .string({ invalid_type_error: 'Password must be string' })
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/^(?=.*[A-Z])/, {
      message: 'Password must contain at least 1 uppercase letter.',
    })
    .regex(/^(?=.*[a-z])/, {
      message: 'Password must contain at least 1 lowercase letter.',
    })
    .regex(/^(?=.*[0-9])/, {
      message: 'Password must contain at least 1 number.',
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: 'Password must contain at least 1 character.',
    }),
  phone: z
    .string({ invalid_type_error: 'Phone number must be string.' })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        'Phone number must be valid for Bangladesh. +8801XXXXXXXXX or 01XXXXXXXXX',
    })
    .optional(),
  address: z
    .string({ invalid_type_error: 'Address must be string.' })
    .max(200, { message: 'Address cannot 200 characters.' })
    .optional(),
})

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Name must be string.' })
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(50, { message: "Name can't  50 characters." })
    .optional(),
  password: z
    .string({ invalid_type_error: 'Password must be string' })
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/^(?=.*[A-Z])/, {
      message: 'Password must contain at least 1 uppercase letter.',
    })
    .regex(/^(?=.*[a-z])/, {
      message: 'Password must contain at least 1 lowercase letter.',
    })
    .regex(/^(?=.*[0-9])/, {
      message: 'Password must contain at least 1 number.',
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: 'Password must contain at least 1 character.',
    })
    .optional(),
  phone: z
    .string({ invalid_type_error: 'Phone number must be string.' })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        'Phone number must be valid for Bangladesh. +8801XXXXXXXXX or 01XXXXXXXXX',
    })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z
    .boolean({ invalid_type_error: 'isDeleted must be true or false.' })
    .optional(),
  isVerified: z
    .boolean({ invalid_type_error: 'isVerified must be true or false' })
    .optional(),
  address: z
    .string({ invalid_type_error: 'Address must be string.' })
    .max(200, { message: "Address can't exceed 200 characters." })
    .optional(),
})
