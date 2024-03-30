import express from 'express'
import bodyParser from 'body-parser'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import mongoose from 'mongoose'
import { EventDoc, EventModel } from './models/event'
import { UserDoc, UserModel } from './models/user'
import bcrypt from 'bcryptjs'

const app = express()

export type Event = {
  title: string
  description: string
  price: number
  date?: Date
  creator: User
}

export type User = {
  email: string
  password: string
}

app.use(bodyParser.json())

const events = async (
  eventIds: EventDoc[] | undefined
): Promise<EventDoc[]> => {
  try {
    const foundEvents = await EventModel.find({ _id: { $in: eventIds } })
    return foundEvents.map((event) => {
      return { ...event._doc, _id: event.id, creator: user(event.creator) }
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
      createdEvents: events(foundUser?.createdEvents),
    }
  } catch (err) {
    throw err
  }
}

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
      }

      type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
      }

      input UserInput {
        email: String!
        password: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: async () => {
        try {
          const events = await EventModel.find()
          const result = events.map(
            ({ id, title, description, price, date, creator }) => {
              console.log({ id, title, description, price, date, creator })
              return {
                _id: id,
                title,
                description,
                price,
                date,
                creator: user(creator),
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
          return { ...savedEvent._doc, creator: user(savedEvent.creator) }
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
          console.log(result)
          return { ...result._doc, password: null }
        } catch (err) {
          console.log(err)
          throw err
        }
      },
    },
    graphiql: true,
  })
)

async function connectToDatabase() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSOWRD}@cluster0.bnb7qpm.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    console.log('Connection succeeded')
    app.listen(3000)
  } catch (err) {
    console.log(err)
  }
}

connectToDatabase()
