import bcrypt from 'bcryptjs'
import { EventDoc, EventModel } from '../../models/event'
import { UserDoc, UserModel } from '../../models/user'
import { BookingModel, BookingDoc } from '../../models/booking'

const fetchEvents = async (eventIds: EventDoc[]): Promise<EventDoc[]> => {
  try {
    const foundEvents = await EventModel.find({ _id: { $in: eventIds } })
    return foundEvents.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        date: event.date.toISOString(),
        creator: () => fetchUser(event.creator),
      }
    })
  } catch (err) {
    throw err
  }
}

const fetchUser = async (userId: UserDoc): Promise<UserDoc> => {
  try {
    const foundUser = await UserModel.findById(userId)
    if (!foundUser) {
      throw new Error('User not found')
    }
    return {
      ...foundUser._doc,
      _id: foundUser.id,
      createdEvents: () => fetchEvents(foundUser.createdEvents),
    }
  } catch (err) {
    throw err
  }
}

const fetchEvent = async (eventId: EventDoc): Promise<EventDoc> => {
  try {
    const foundEvent = await EventModel.findById(eventId)
    if (!foundEvent) {
      throw new Error('Event not found')
    }
    return {
      ...foundEvent._doc,
      _id: foundEvent.id,
      date: foundEvent.date.toISOString(),
      creator: () => fetchUser(foundEvent.creator),
    }
  } catch (err) {
    throw err
  }
}

export const graphQlResolvers = {
  events: async () => {
    try {
      const events = await EventModel.find()
      const result = events.map(
        ({ id, title, description, price, date, creator }) => {
          return {
            _id: id,
            title,
            description,
            price,
            date: date.toISOString(),
            creator: () => fetchUser(creator),
          }
        }
      )
      console.log(result)
      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  bookings: async () => {
    try {
      const bookings = await BookingModel.find()
      const result = bookings.map(
        ({ id, event, user, createdAt, updatedAt }) => {
          return {
            _id: id,
            event: () => fetchEvent(event),
            user: () => fetchUser(user),
            createdAt: new Date(createdAt).toISOString(),
            updatedAt: new Date(updatedAt).toISOString(),
          }
        }
      )
      console.log(result)
      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  createEvent: async ({
    eventInput,
  }: {
    eventInput: EventDoc
  }): Promise<EventDoc> => {
    const { title, description, price } = eventInput
    const event = new EventModel({
      title,
      description,
      price: +price,
      date: new Date(),
      creator: '66077b162fc1a998a05a4be4', //Dummy value until users can create events
    })

    try {
      const savedEvent = await event.save()
      const foundUser = await UserModel.findById('66077b162fc1a998a05a4be4') //Dummy value until users can create events
      if (!foundUser) {
        throw new Error('User not found')
      }
      foundUser.createdEvents?.push(event)
      await foundUser.save()
      const result = {
        ...savedEvent._doc,
        creator: () => fetchUser(savedEvent.creator),
        date: savedEvent.date.toISOString(),
      }
      console.log(result)
      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  createUser: async ({
    userInput,
  }: {
    userInput: UserDoc
  }): Promise<UserDoc> => {
    const { email, password } = userInput
    try {
      const foundUser = await UserModel.findOne({ email })
      if (foundUser) {
        throw new Error('User already exists')
      }
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new UserModel({
        email,
        password: hashedPassword,
      })
      const result = await user.save()
      console.log({ ...result._doc, password: null })
      return { ...result._doc, password: null }
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  bookEvent: async ({ eventId }: EventDoc) => {
    try {
      const foundEvent = await EventModel.findById(eventId)
      const booking = new BookingModel({
        user: '66077b162fc1a998a05a4be4',
        event: foundEvent,
      })
      const result = await booking.save()
      return {
        ...result._doc,
        event: () => fetchEvent(booking.event),
        user: () => fetchUser(booking.user),
        createdAt: new Date(result._doc.createdAt).toISOString(),
        updatedAt: new Date(result._doc.updatedAt).toISOString(),
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  cancelBooking: async ({ bookingId }: BookingDoc) => {
    try {
      const foundBooking = await BookingModel.findById(bookingId).populate(
        'event'
      )
      if (!foundBooking) {
        throw new Error('No booking found')
      }

      const foundEvent = {
        ...foundBooking.event._doc,
        _id: foundBooking.event.id,
        date: foundBooking.date.toISOString(),
        creator: () => fetchUser(foundBooking.event._doc.creator),
      }
      await BookingModel.findByIdAndDelete(bookingId)
      return foundEvent
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
