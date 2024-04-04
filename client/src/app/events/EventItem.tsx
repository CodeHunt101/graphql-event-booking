import Modal from '../components/Modal/Modal'
import EventItemModalContent from './EventItemModalContent'

export type UserProps = {
  _id: string
  email?: string
}
export type EventProps = {
  _id: string
  title: string
  description: string
  price: number
  date: string
  creator: UserProps
}

const EventItem = ({
  keyId,
  event,
  authUserId,
  showModal,
  selectEvent,
  confirmText,
  handleBookEvent,
}: {
  keyId: string
  event: EventProps
  authUserId?: string
  showModal: (id: string) => void
  selectEvent: (event: EventProps) => void
  confirmText: string
  handleBookEvent: () => void
}) => {
  const { title, price, date, creator } = event
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>
          ${price} {new Date(date).toLocaleDateString()}
        </p>
        <div className="card-actions justify-end">
          {authUserId !== creator._id || !authUserId ? (
            <button
              onClick={() => {
                showModal(keyId)
                selectEvent(event)
              }}
              className="btn btn-primary"
            >
              View Details
            </button>
          ) : (
            <p>You&apos;re the creator of this event</p>
          )}
        </div>
        <Modal
          idName={keyId}
          canConfirm
          canCancel
          onConfirm={handleBookEvent}
          confirmText={confirmText}
        >
          <EventItemModalContent {...event} />
        </Modal>
      </div>
    </div>
  )
}

export default EventItem
