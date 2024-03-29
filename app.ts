import express from 'express'
import bodyParser from 'body-parser'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

const app = express()

app.use(bodyParser.json())
app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
      type RootQuery {
        events: [String!]!
      }

      type RootMutation {
        createEvent(name: String): String
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return ['Romantic Cooking', 'Sailing', 'Coding']
      },
      createEvent: ({ name }: { name: string }) => {
        const eventName = name
        return eventName
      },
    },
    graphiql: true,
  })
)

app.listen(3000)
