import 'dotenv/config'
import express, { Express, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

const app: Express = express()
app.use(express.json())
const port = 3002

type SystemBCredentials = {
  apiKey: string;
  clientId: string;
}
type SystemBBooking = {
  venueId: number;
  date: Date;
  contact: {
    email: string;
    fullName: string
  }
}

function isAuthorized(credentials : SystemBCredentials) : boolean {
  console.log('Authorizing')
  return !!(credentials.clientId && credentials.apiKey)
}

app.post('/register', (req: Request, res: Response) => {
  if(process.env.DEBUG_VERBOSE) {
    console.log("-----------------------------------------------")
    console.log("/register")
    console.log(req)
  }
  // As this is mock server, we will assume that"
  // it will respond with status 200 response when accepted, 
  //                      status 400 response when rejected
  if(!req.headers?.authorization) {
    console.log('Bad request')
    res.status(400).end({ errors: ['Bad request']})
  }
  const credentials = JSON.parse(req.headers.authorization!) as SystemBCredentials
  console.log(`SystemB: register credentials: ${credentials}`)
  if(isAuthorized(credentials)) {
    // TODO: register retrieved data
    console.log('Authorized')
    const response = { message: 'Registered successfully'}
    res.status(200).send(JSON.stringify(response))
  } else {
    console.log('Unauthorized')
    const response = { errors: ['Unauthorized request'], message: 'Unauthorized request' }
    res.status(400).send(JSON.stringify(response))
  }
})

app.listen(port, () => {
  console.log(`Mock system B listening on http://127.0.0.1:${port}`)
})