import mongoose from 'mongoose'
import { UserDoc } from './user'
import { EventDoc } from './event'

const Schema = mongoose.Schema

const bookingSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true
})

export interface BookingDoc extends mongoose.Document {
  [x: string]: any
  event: EventDoc
  user: UserDoc
  createdAt: Date
  updatedAt: Date
}

export const BookingModel = mongoose.model<BookingDoc>('Booking', bookingSchema)
