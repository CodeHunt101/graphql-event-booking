'use client'

import AuthContext, { Login, Logout } from '../auth-context'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function Providers({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string>()
  const [userId, setUserId] = useState<string>()
  const router = useRouter()

  const login: Login = (token, userId, tokenExpiration) => {
    setToken(token)
    setUserId(userId)
  }

  const logout: Logout = () => {
    setToken('')
    setUserId('')
    if (!token) router.push('/auth')
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default Providers
