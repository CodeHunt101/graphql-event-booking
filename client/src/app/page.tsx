'use client'
import { useContext } from 'react'
import AuthPage from './auth/page'
import AuthContext from './context/auth-context'
import { redirect } from 'next/navigation'

export default function Home() {
  const { token } = useContext(AuthContext)
  if (token) redirect('/events')
  return <AuthPage />
}
