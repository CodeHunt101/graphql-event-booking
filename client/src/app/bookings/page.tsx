'use client'
import { redirect } from 'next/navigation'
import { useContext } from 'react'
import AuthContext from '../context/auth-context'
const BookingsPage = () => {
  const { token } = useContext(AuthContext)
  if (!token) redirect('/')
  return <h1>Bookings!</h1>
}

export default BookingsPage
