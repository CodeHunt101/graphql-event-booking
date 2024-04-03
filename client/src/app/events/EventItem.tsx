import Modal from '../components/Modal/Modal'

type CreatorProps = {
  _id: string
  email?: string
}
export type EventProps = {
  _id: string
  title: string
  description: string
  price: number
  date: string
  creator: CreatorProps
}

const EventItem = ({
  keyId,
  event,
  authUserId,
  showModal,
}: {
  keyId: string
  event: EventProps
  authUserId?: string
  showModal: (id: string) => void
}) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{event.title}</h2>
        <p>
          ${event.price} {new Date(event.date).toLocaleDateString()}
        </p>
        <div className="card-actions justify-end">
          {authUserId !== event.creator._id || !authUserId ? (
            <button
              onClick={() => showModal(keyId)}
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
          onConfirm={() => null}
          confirmText="Book event"
        >
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <p>
            <b>Price:</b> ${`${event.price}`}
          </p>
          <p>
            <b>Date:</b> {new Date(event.date).toLocaleString()}
          </p>
          <p>
            <b>Creator:</b> {`${event.creator.email}`}
          </p>
        </Modal>
      </div>
    </div>
  )
}

export default EventItem
