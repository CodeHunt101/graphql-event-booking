import express from 'express'
import bodyParser from 'body-parser'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

const app = express()

type Event = {
  title: string
  description: string
  price: number
  date?: string
}

const events: Event[] = []

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
      events: () => {
        return events
      },
      createEvent: ({ eventInput }: {eventInput: Event}): Event => {
        const { title, description, price } = eventInput
        
        console.log(eventInput)
        const event = {
          _id: Math.random().toString(),
          title,
          description,
          price: +price,
          date: new Date().toISOString(),
        }
        events.push(event)
        return event
      },
    },
    graphiql: true,
  })
)

app.listen(3000)
