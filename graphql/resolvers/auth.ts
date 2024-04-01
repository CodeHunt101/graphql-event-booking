import bcrypt from 'bcryptjs'
import { UserDoc, UserModel } from '../../models/user'

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
}
