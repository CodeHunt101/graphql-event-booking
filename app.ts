import express from 'express'
import bodyParser from 'body-parser'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import mongoose from 'mongoose'
import { EventModel } from './models/event'

const app = express()

type Event = {
  title: string
  description: string
  price: number
  date?: Date
}

app.use(bodyParser.json())
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
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
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
          const result: Event[] = events.map(
            ({ id, title, description, price, date }) => {
              return {
                _id: id,
                title,
                description,
                price,
                date,
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
      createEvent: async ({ eventInput }: { eventInput: Event }) => {
        const { title, description, price } = eventInput
        const event = new EventModel({
          title,
          description,
          price: +price,
          date: new Date(),
        })

        try {
          const result = await event.save()
          console.log(result)
          return result
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
