import bcrypt from 'bcryptjs'
import { UserDoc, UserModel } from '../../models/user'
import jwt from 'jsonwebtoken'

export const authResolvers = {
  createUser: async ({
    userInput,
  }: {
    userInput: UserDoc
  }): Promise<UserDoc> => {
    const { email, password } = userInput
    try {
      const foundUser = await UserModel.findOne({ email })
      if (foundUser) {
        throw new Error('User already exists')
      }
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new UserModel({
        email,
        password: hashedPassword,
      })
      const result = await user.save()
      console.log({ ...result._doc, password: null })
      return { ...result._doc, password: null }
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  login: async ({ email, password }: { email: string; password: string }) => {
    const foundUser = await UserModel.findOne({ email })
    if (!foundUser) {
      throw new Error('User does not exist')
    }
    const isPasswordEqual = await bcrypt.compare(password, foundUser.password)
    console.log({ isPasswordEqual })
    if (!isPasswordEqual) {
      throw new Error('Password is incorrect')
    }
    const token = jwt.sign(
      {
        userId: foundUser.id,
        email: foundUser.email,
      },
      'somesupersecretkey',
      {
        expiresIn: '1h',
      }
    )
    return { userId: foundUser.id, token, tokenExpiration: 1 }
  },
}
