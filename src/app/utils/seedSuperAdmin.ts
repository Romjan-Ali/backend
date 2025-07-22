import bcrypt from 'bcryptjs'
import { Role, type IAuthProvider, type IUser } from '../modules/user/user.interface'
import { User } from '../modules/user/user.model'
import { envVars } from '../config/env'

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    })
    if (isSuperAdminExists) {
      console.log('Super admin already exists')
      return
    }
    console.log('Trying to create Super Admin ...')

    const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND) )

    const authProvider: IAuthProvider = {
        provider: 'credentials',
        providerId: envVars.SUPER_ADMIN_EMAIL
    }

    const payload: IUser = {
      name: 'Super Admin',
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider]
    }

    const superAdmin = await User.create(payload)

    console.log('Super Admin created successfully! \n')
    console.log(superAdmin)
  } catch (err) {
    console.log(err)
  }
}
