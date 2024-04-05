'use client'
import { redirect } from 'next/navigation'
import { useContext } from 'react'
import AuthContext, { AuthContextProps } from '../context/auth-context'
import BookingList from './BookingList'
const BookingsPage = () => {
  const { token } = useContext<AuthContextProps>(AuthContext)
  if (!token) redirect('/auth')

  return (
    <div className="flex flex-col items-center">
      <h3>Your Bookings!</h3>
      <div className="flex flex-wrap justify-center gap-5">
        <BookingList />
      </div>
    </div>
  )
}

export default BookingsPage
