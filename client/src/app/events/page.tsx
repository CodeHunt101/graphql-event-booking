'use client'
import { useRef, useContext, useEffect, useState } from 'react'
import Modal from '../components/Modal/Modal'
import AuthContext, { AuthContextProps } from '../context/auth-context'
import { EventProps } from './EventItem'
import EventList from './EventList'
import CreateEventModalContent from './CreateEventModalContent'

const EventsPage = () => {
  const { token, userId } = useContext<AuthContextProps>(AuthContext)
  const [events, setEvents] = useState<EventProps[]>([])
  const titleRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  const showEventModal = (id: string) => {
    ;(document.getElementById(id) as HTMLDialogElement).showModal()
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

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleModalConfirm = async () => {
    if (!userId) return
    const title = titleRef.current?.value
    const price = Number(priceRef.current?.value)
    const date = dateRef.current?.value
    const description = descriptionRef.current?.value

    if (
      title?.trim().length === 0 ||
      price < 0 ||
      date?.trim().length === 0 ||
      description?.trim().length === 0
    ) {
      console.log('invalid')
      return
    }

    const requestBody = {
      query: `
        mutation CreateEvent ($title: String!, $description: String!, $price: Float!, $date: String!) {
          createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
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
        title,
        description,
        price,
        date,
      },
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
        <EventList events={events} showEventModal={showEventModal} />
      </div>
      <Modal
        idName="create-event-modal"
        canCancel
        canConfirm
        confirmText="Confirm"
        onConfirm={handleModalConfirm}
      >
        <CreateEventModalContent
          titleRef={titleRef}
          descriptionRef={descriptionRef}
          priceRef={priceRef}
          dateRef={dateRef}
        />
      </Modal>
    </div>
  )
}

export default EventsPage
