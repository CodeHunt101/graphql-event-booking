import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import { graphqlHTTP } from 'express-graphql'
import { graphQlSchema } from './graphql/schema'
import { rootResolvers } from './graphql/resolvers'

const app = express()

app.use(bodyParser.json())

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: rootResolvers,
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
