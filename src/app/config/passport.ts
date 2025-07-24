import passport from 'passport'
import {
  Strategy as GoogleStrategy,
  type Profile,
  type VerifyCallback,
} from 'passport-google-oauth20'
import { Strategy as LocalStrategy } from 'passport-local'
import { User } from '../modules/user/user.model'
import { envVars } from './env'
import { Role, type IUser } from '../modules/user/user.interface'
import bcrypt from 'bcryptjs'

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email })

        if (!isUserExist) {
          return done("User doesn't exist")
        }

        const isGoogleAuthenticated = isUserExist?.auths?.some(
          (providerObject) => providerObject.provider == 'google'
        )

        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(null, false, {
            message:
              'You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.',
          })
        }

        const isPasswordMatched = await bcrypt.compare(
          password,
          isUserExist.password as string
        )

        if (!isPasswordMatched) {
          return done(null, false, { message: "Password doesn't match" })
        }

        return done(null, isUserExist)

      } catch (error) {
        console.log('Local Strategy Error', error)
        return done(error)
      }
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken,
      refreshToken,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value
        if (!email) {
          return done(null, false, { message: 'No email found' })
        }
        let user = await User.findOne({ email })
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: 'google',
                providerId: profile.id,
              },
            ],
          })
        }
        return done(null, user)
      } catch (error) {
        console.log('Google Strategy Error', error)
        return done(error)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, (user as IUser)._id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    console.log(error)
    done(error)
  }
})
