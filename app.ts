import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import { graphqlHTTP } from 'express-graphql'
import { graphQlSchema } from './graphql/schema'
import { rootResolvers } from './graphql/resolvers'
import { isAuth } from './middleware/is-auth'

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(isAuth)

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
