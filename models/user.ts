import mongoose from 'mongoose'
import { EventDoc } from './event'

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }
  ]
})

export interface UserDoc extends mongoose.Document {
  [x: string]: any
  _id: string
  email: string
  password: string
  createdEvents?: EventDoc[]
}

export const UserModel = mongoose.model<UserDoc>('User', userSchema)
