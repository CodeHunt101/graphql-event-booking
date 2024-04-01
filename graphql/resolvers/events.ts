import { Request } from 'express'
import { dateToString } from '../../helpers/date'
import { EventDoc, EventModel } from '../../models/event'
import { UserModel } from '../../models/user'
import { fetchUser } from './merge'
import { IGetUserAuthInfoRequest } from '../../middleware/is-auth'

export const transformEvent = ({ _doc, id, date, creator }: EventDoc) => ({
  ..._doc,
  _id: id,
  date: dateToString(date),
  creator: () => fetchUser(creator),
})

export const eventResolvers = {
  events: async () => {
    try {
      const events = await EventModel.find()
      const result = events.map(transformEvent)
      console.log(result)
      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  createEvent: async (
    {
      eventInput,
    }: {
      eventInput: EventDoc
    },
    req: IGetUserAuthInfoRequest
  ): Promise<EventDoc> => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    const { title, description, price, date } = eventInput
    const event = new EventModel({
      title,
      description,
      price: +price,
      date,
      creator: req.userId, //Dummy value until users can create events
    })

    try {
      const savedEvent = await event.save()
      const foundUser = await UserModel.findById(req.userId) //Dummy value until users can create events
      if (!foundUser) {
        throw new Error('User not found')
      }
      foundUser.createdEvents?.push(event)
      await foundUser.save()
      const result = transformEvent(savedEvent)
      console.log(result)
      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
