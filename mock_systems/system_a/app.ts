import 'dotenv/config'
import express, { Express, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

const app: Express = express()
app.use(express.json())
const port = process.env.PORT || 3000

type SystemACredentials = {
  login: string;
  password: string;
  apikey: string;
}
type SystemAContact = {
  email: string;
  fullName: string
}
type SystemABooking = {
  venue_id: string;
  date_start: Date;
  date_end: Date;
  contact_id: string;
}

let sessionUuids: Array<string> = []

function authorize(credentials: SystemACredentials) {
  return credentials.login && credentials.password && credentials.apikey
}

app.post('/login', (req: Request, res: Response) => {
  if(process.env.DEBUG_VERBOSE) {
    console.log("/login")
    console.log(req.body)
  }
  // As this is mock server, we will assume that"
  // it will respond with status 200 response when accepted, 
  //                      status 400 response when rejected
  const credentials = req.body as SystemACredentials
  if(authorize(credentials)) {
    // used uuid as sessionID, passing directly instead of via JWT for mocking purposes, 
    // normally would establish proper authorization protocol
    const uuid = uuidv4()
    sessionUuids.push(uuid)
    console.log(`Session ${uuid} established!`)
    const response = { jwt_token: uuid, message: 'Connection successful'}
    res.status(200).end(JSON.stringify(response))
  } else {
    const response = { errors: ['Credentials do not match'], message: 'Connection failed' }
    res.status(400).end(JSON.stringify(response))
  }
})

function isAuthorized(jwt_token: string) {
  // TODO:
  // validate JWT TOKEN and check permissions, eventually pass if authorized
  return true
}

app.post('/register', (req: Request, res: Response) => {
  if(process.env.DEBUG_VERBOSE) {
    console.log("-----------------------------------------------")
    console.log("/register")
    console.log(req.headers)
  }
  if(req.headers.authorization && isAuthorized(req.headers.authorization)) {
    console.log('Registered successfully')
    const response = { message: 'Registered successfully' }
    const stringifiedResponse = JSON.stringify(response)
    res.status(200).end(stringifiedResponse)
  } else {
    console.log('Unathorized request')
    const response = { errors: ['Unauthorized request'], message: 'Unauthorized request'}
    res.status(400).end(JSON.stringify(response))
  }
})

app.listen(port, () => {
  console.log(`Mock system A listening on http://127.0.0.1:${port}`)
})
