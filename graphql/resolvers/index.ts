import bcrypt from 'bcryptjs'
import { EventDoc, EventModel } from '../../models/event'
import { UserDoc, UserModel } from '../../models/user'
import mongoose from 'mongoose'

const events = async (
  eventIds: EventDoc[] | undefined
): Promise<EventDoc[]> => {
  try {
    const foundEvents = await EventModel.find({ _id: { $in: eventIds } })
    return foundEvents.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        creator: () => user(event.creator),
        date: event.date.toISOString(),
      }
    })
  } catch (err) {
    throw err
  }
}

const user = async (userId: UserDoc): Promise<UserDoc> => {
  try {
    const foundUser = await UserModel.findById(userId)
    return {
      ...foundUser?._doc,
      _id: foundUser?.id,
      createdEvents: () => events(foundUser?.createdEvents),
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
            creator: () => user(creator),
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
        creator: () => user(savedEvent.creator),
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
}
