import { eventResolvers } from './events'
import { bookingResolvers } from './bookings'
import { authResolvers } from './auth'

export const rootResolvers = {
  ...eventResolvers,
  ...bookingResolvers,
  ...authResolvers,
}
