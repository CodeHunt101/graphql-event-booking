import { useContext, useState } from 'react'
import EventItem, { EventProps } from './EventItem'
import AuthContext, { AuthContextProps } from '../context/auth-context'

const EventList = ({
  events,
  showEventModal,
}: {
  events: EventProps[]
  showEventModal: (id: string) => void
}) => {
  const { token, userId } = useContext<AuthContextProps>(AuthContext)
  const [selectedEvent, setSelectedEvent] = useState<EventProps | null>(null)

  const handleSelectEvent = (event: EventProps) => {
    const selectedEvent = events?.find((e) => e._id === event._id) ?? null
    setSelectedEvent(() => selectedEvent)
  }
  const handleBookEvent = async () => {
    if (!token) {
      setSelectedEvent(null)
      return
    }

    if (!selectedEvent) return
    const requestBody = {
      query: `
        mutation {
          bookEvent(eventId: "${selectedEvent._id}") {
            _id
            createdAt
            updatedAt
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
      console.log(jsonResp)
      setSelectedEvent(null)
    } catch (error) {
      console.log(error)
    }
  }
  return events.map((event, index) => (
    <div key={index}>
      <EventItem
        keyId={`event-details-${index}`}
        event={event}
        authUserId={userId}
        showModal={() => showEventModal(`event-details-${index}`)}
        selectEvent={handleSelectEvent}
        confirmText={token ? 'Book' : 'Confirm'}
        handleBookEvent={handleBookEvent}
      />
    </div>
  ))
}

export default EventList
