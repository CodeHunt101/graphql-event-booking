'use client'
import Modal from '../components/Modal/Modal'
const EventsPage = () => {
  const showEventModal = () =>
    (document.getElementById('event-modal') as HTMLDialogElement).showModal()
  const handleModalConfirm = () => {
    console.log('confimed')
  }

  return (
    <div className="flex flex-col items-center">
      <h3>Share your own Events!</h3>
      <button onClick={showEventModal} className="btn btn-primary">
        Create Event
      </button>
      <Modal canCancel canConfirm onConfirm={handleModalConfirm}>
        <h3 className="font-bold text-lg">Add Event</h3>
        <p className="py-4">Modal Content</p>
      </Modal>
    </div>
  )
}

export default EventsPage
