import { UserDoc, UserModel } from '../../models/user'
import { EventDoc, EventModel } from '../../models/event'
import { transformEvent } from './events'
import DataLoader from 'dataloader'

async function batchEvents(eventIds: readonly EventDoc[]) {
  console.log('Batching events', eventIds)
  const events = await EventModel.find({ _id: { $in: eventIds } })
  const eventMap: { [x: string]: EventDoc } = {}
  events.forEach((event) => {
    eventMap[event.id] = event
  })
  return eventIds.map((eventId) => eventMap[eventId._id])
}

export const eventLoader = new DataLoader(batchEvents)

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
    const foundEvent = await eventLoader.load(eventId)
    if (!foundEvent) {
      throw new Error('Event not found')
    }
    return transformEvent(foundEvent)
  } catch (err) {
    throw err
  }
}

//TODO: probably add batch for users but not necessary at this point

// async function batchUsers(userIds: readonly UserDoc[]) {
//   console.log('Batching users', userIds);
//   const users = await UserModel.find({ _id: { $in: userIds } });
//   const userMap: {[x:string]:UserDoc} = {};
//   users.forEach(user => {
//     userMap[user.id] = user;
//   });
//   return userIds.map(userId => userMap[userId._id]);
// }

// export const userLoader = () => new DataLoader(batchUsers);

export const fetchUser = async (userId: UserDoc): Promise<UserDoc> => {
  try {
    const foundUser = await UserModel.findById(userId)
    if (!foundUser) {
      throw new Error('User not found')
    }
    return {
      ...foundUser._doc,
      _id: foundUser.id,
      createdEvents: async () =>
        await eventLoader.loadMany(foundUser.createdEvents),
    }
  } catch (err) {
    throw err
  }
}
