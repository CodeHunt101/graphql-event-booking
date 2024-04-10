import { useContext, useEffect, useState } from 'react'
import AuthContext, { AuthContextProps } from '../context/auth-context'
import BookingItem, { BookingProps } from './BookingItem'

const BookingList = () => {
  const { token, userId } = useContext<AuthContextProps>(AuthContext)
  const [selectedBooking, setSelectedBooking] = useState<BookingProps | null>(
    null
  )
  const [bookings, setBookings] = useState<BookingProps[]>([])

  const showBookingModal = (id: string) => {
    ;(document.getElementById(id) as HTMLDialogElement).showModal()
  }

  const handleSelectBooking = (booking: BookingProps) => {
    const selectedBooking = bookings.find((b) => b._id === booking._id) ?? null
    console.log({ selectedBooking })
    setSelectedBooking(() => selectedBooking)
  }

  useEffect(() => {
    const fetchBookings = async () => {
      const requestBody = {
        query: `
          query {
            bookings {
              _id
              event {
                _id
                title
                description
                date
                creator {
                  email
                }
              }
              user {
                _id
                email
              }
              createdAt
            }
          }
        `,
      }

      try {
        const response = await fetch('http://localhost:3000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status !== 200 && response.status !== 201) {
          throw new Error('Failed!')
        }
        const jsonResp = await response.json()
        setBookings(jsonResp.data.bookings)
        console.log({ jsonResp })
      } catch (error) {
        console.log(error)
      }
    }
    fetchBookings()
  }, [token])

  const handleCancelBooking = async () => {
    if (!selectedBooking) return
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `,
      variables: {
        id: selectedBooking._id
      }
    }

    try {
      const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed!')
      }
      const jsonResp = await response.json()
      setBookings((prevState) => {
        let updatedBookings = [...prevState]
        updatedBookings = updatedBookings.filter(
          (booking) => booking._id !== selectedBooking._id
        )
        return updatedBookings
      })
      console.log({ jsonResp })
    } catch (error) {
      console.log(error)
    }
  }

  return bookings.map((booking, index) => {
    return (
      <div key={index}>
        <BookingItem
          keyId={`booking-details-${index}`}
          booking={booking}
          authUserId={userId}
          showModal={() => showBookingModal(`booking-details-${index}`)}
          selectBooking={handleSelectBooking}
          confirmText={'Cancel booking'}
          handleCancelBooking={handleCancelBooking}
        />
      </div>
    )
  })
}

export default BookingList
