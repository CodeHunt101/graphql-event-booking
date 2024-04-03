import { createContext, Context } from 'react'

export type Login = (
  token: string,
  userId: string,
  tokenExpiration: number
) => void
export type Logout = () => void

type AuthContextProps = {
  token?: string
  userId?: string
  login?: Login
  logout?: Logout
}

const AuthContext: Context<AuthContextProps> = createContext({})
export default AuthContext
