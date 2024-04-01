import { UserDoc, UserModel } from '../../models/user'
import { EventDoc, EventModel } from '../../models/event'
import { transformEvent } from './events'

export const fetchEvents = async (
  eventIds: EventDoc[]
): Promise<EventDoc[]> => {
  try {
    const foundEvents = await EventModel.find({ _id: { $in: eventIds } })
    return foundEvents.map(transformEvent)
  } catch (err) {
    throw err
  }
}

export const fetchEvent = async (eventId: EventDoc): Promise<EventDoc> => {
  try {
    const foundEvent = await EventModel.findById(eventId)
    if (!foundEvent) {
      throw new Error('Event not found')
    }
    return transformEvent(foundEvent)
  } catch (err) {
    throw err
  }
}

export const fetchUser = async (userId: UserDoc): Promise<UserDoc> => {
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
