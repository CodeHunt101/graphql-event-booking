import { dateToString } from '../../helpers/date'
import { BookingDoc, BookingModel } from '../../models/booking'
import { EventDoc, EventModel } from '../../models/event'
import { transformEvent } from './events'
import { fetchEvent, fetchUser } from './merge'
import { IGetUserAuthInfoRequest } from '../../middleware/is-auth'
import { UserModel } from '../../models/user'

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
  bookings: async (_: any, req: IGetUserAuthInfoRequest) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const foundUser = await UserModel.findById(req.userId)
      if (!foundUser) return
      const bookings = await BookingModel.find({user: foundUser})
      const result = bookings.map(transformBooking)
      console.log(result)
      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  bookEvent: async ({ eventId }: EventDoc, req: IGetUserAuthInfoRequest) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const foundEvent = await EventModel.findById(eventId)
      const booking = new BookingModel({
        user: req.userId,
        event: foundEvent,
      })
      const result = await booking.save()
      return transformBooking(result)
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  cancelBooking: async (
    { bookingId }: BookingDoc,
    req: IGetUserAuthInfoRequest
  ) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
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
