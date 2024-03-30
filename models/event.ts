import mongoose from 'mongoose'
import { UserDoc } from './user'

const Schema = mongoose.Schema

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

export interface EventDoc extends mongoose.Document {
  [x: string]: any
  title: string
  description: string
  date: Date
  price: number
  creator: UserDoc
}

export const EventModel = mongoose.model<EventDoc>('Event', eventSchema)
