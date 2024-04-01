import { dateToString } from '../../helpers/date'
import { BookingDoc, BookingModel } from '../../models/booking'
import { EventDoc, EventModel } from '../../models/event'
import { transformEvent } from './events'
import { fetchEvent, fetchUser } from './merge'

export const transformBooking = ({
  id,
  event,
  user,
  createdAt,
  updatedAt,
}: BookingDoc) => ({
  _id: id,
  event: () => fetchEvent(event),
  user: () => fetchUser(user),
  createdAt: dateToString(createdAt),
  updatedAt: dateToString(updatedAt),
})

export const bookingResolvers = {
  bookings: async () => {
    try {
      const bookings = await BookingModel.find()
      const result = bookings.map(transformBooking)
      console.log(result)
      return result
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
      return transformBooking(result)
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

      const foundEvent = transformEvent(foundBooking.event)
      await BookingModel.findByIdAndDelete(bookingId)
      return foundEvent
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
