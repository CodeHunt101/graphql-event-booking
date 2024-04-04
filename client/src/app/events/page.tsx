'use client'
import { useRef, useContext, useEffect, useState } from 'react'
import Modal from '../components/Modal/Modal'
import AuthContext, { AuthContextProps } from '../context/auth-context'
import EventItem from './EventItem'
import { EventProps } from './EventItem'

const EventsPage = () => {
  const { token, userId } = useContext<AuthContextProps>(AuthContext)
  const [events, setEvents] = useState<EventProps[]>([])
  const titleRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventProps | null>(null)

  const showEventModal = (id: string) => {
    (document.getElementById(id) as HTMLDialogElement).showModal()
  }

  const handleSelectEvent = (event: EventProps) => {
    const selectedEvent = events?.find(e => e._id === event._id) ?? null
    console.log({selectedEvent})
    setSelectedEvent(()=>selectedEvent)
  }

  const fetchEvents = async () => {
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            price
            date
            creator {
                _id
                email
            }
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
        },
      })
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed!')
      }
      const jsonResp = await response.json()
      setEvents(jsonResp.data.events)
    } catch (error) {
      console.log(error)
    }
  }

  const renderEvents = () => {
    return events.map((event, index) => {
      return (
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
      )
    })
  }

  useEffect(() => {
    fetchEvents()
  }, [])

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

  const handleModalConfirm = async () => {
    if (!userId) return
    const title = titleRef.current?.value
    const price = priceRef.current?.value
    const date = dateRef.current?.value
    const description = descriptionRef.current?.value

    if (
      title?.trim().length === 0 ||
      Number(price) < 0 ||
      date?.trim().length === 0 ||
      description?.trim().length === 0
    ) {
      console.log('invalid')
      return
    }

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
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
      console.log({ response: jsonResp })
      setEvents((prevState) => {
        const updatedEvents = [...prevState]
        updatedEvents.push({
          _id: jsonResp.data.createEvent._id,
          title: jsonResp.data.createEvent.title,
          description: jsonResp.data.createEvent.description,
          price: jsonResp.data.createEvent.price,
          date: jsonResp.data.createEvent.date,
          creator: {
            _id: jsonResp.data.createEvent.creator._id,
          },
        })
        return updatedEvents
      })
      return jsonResp
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h3>Share your own Events!</h3>
      {token && (
        <button
          onClick={() => showEventModal('create-event-modal')}
          className="btn btn-primary"
        >
          Create Event
        </button>
      )}
      <div className="flex flex-wrap justify-center gap-5">
        {renderEvents()}
      </div>
      <Modal
        idName="create-event-modal"
        canCancel
        canConfirm
        confirmText="Confirm"
        onConfirm={handleModalConfirm}
      >
        <h3 className="font-bold text-lg">Add Event</h3>
        <form className="flex flex-col gap-3">
          <label
            className="input input-bordered flex items-center gap-2"
            htmlFor="title"
          >
            Title
            <input type="text" className="grow" id="title" ref={titleRef} />
          </label>
          <label
            className="input input-bordered flex items-center gap-2"
            htmlFor="price"
          >
            Price
            <input type="number" className="grow" id="price" ref={priceRef} />
          </label>
          <label
            className="input input-bordered flex items-center gap-2"
            htmlFor="date"
          >
            Date
            <input
              type="datetime-local"
              className="grow"
              id="date"
              ref={dateRef}
            />
          </label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Description"
            id="description"
            ref={descriptionRef}
          ></textarea>
        </form>
      </Modal>
    </div>
  )
}

export default EventsPage
