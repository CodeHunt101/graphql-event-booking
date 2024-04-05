import Modal from '../components/Modal/Modal'
import { EventProps, UserProps } from '../events/EventItem'
import BookingItemModalContent from './BookingItemModalContent'

export type BookingProps = {
  _id: string
  event: EventProps
  createdAt: string
  user: UserProps
}

const BookingItem = ({
  keyId,
  booking,
  authUserId,
  showModal,
  selectBooking,
  confirmText,
  handleCancelBooking,
}: {
  keyId: string
  booking: BookingProps
  authUserId?: string
  showModal: (id: string) => void
  selectBooking: (booking: BookingProps) => void
  confirmText: string
  handleCancelBooking: () => void
}) => {
  const { createdAt } = booking
  const { title } = booking.event
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{new Date(createdAt).toLocaleDateString()}</p>
        <div className="card-actions justify-end">
          <button
            onClick={() => {
              showModal(keyId)
              selectBooking(booking)
            }}
            className="btn btn-primary"
          >
            View Details
          </button>
        </div>
        <Modal
          idName={keyId}
          canConfirm
          canCancel
          onConfirm={handleCancelBooking}
          confirmText={confirmText}
        >
          <BookingItemModalContent {...booking.event} />
        </Modal>
      </div>
    </div>
  )
}

export default BookingItem
