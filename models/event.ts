import mongoose from 'mongoose'

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
  _id: string
  title: string
  description: string
  date: Date
  price: number
}

export const EventModel = mongoose.model<EventDoc>('Event', eventSchema)
