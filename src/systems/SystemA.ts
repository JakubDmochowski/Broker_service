import { api } from '../api/axios'
import { AxiosResponse } from 'axios'
import { System } from './index'
import type { Booking } from '../schema/Booking';
import type { PropertyPayload } from '../propertyBroker/IPropertyBroker';
import type { RegisterResponse } from '../propertyBroker/IPropertyBroker'

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
// can be extended if properties have more than just Booking data type
type SystemAPayload = (SystemAContact | SystemABooking)[]

type LoginResponseSuccessful = {
  jwt_token: string,
  message: string
}
type LoginResponseUnsuccessful = {
  errors: Array<string>,
  message: string
}
type LoginResponse = LoginResponseSuccessful | LoginResponseUnsuccessful

export class SystemA extends System {
  protected static _instance: SystemA;
  protected url: string = 'http://127.0.0.1:3001';
  protected jwt_token?: string;

  private constructor() {
    super()
  }

  private static getCredentials() : SystemACredentials {
    // store and get from the database if needed, for mock purposes we use env variables
    return {
      login: process.env.SYSTEM_A_LOGIN,
      password: process.env.SYSTEM_A_PASSWORD,
      apikey: process.env.SYSTEM_A_APIKEY
    } as SystemACredentials
  }

  public static getInstance(): SystemA{
    if(!this._instance) {
      this._instance = new SystemA()
    }
    return this._instance
  }

  private async login() : Promise<AxiosResponse<LoginResponse, unknown>> {
    const credentials = SystemA.getCredentials()
    console.log(`SystemACredentials: ${credentials}`)
    const response = await api.post(`${this.url}/login`, credentials)
    this.jwt_token = response.data.jwt_token
    return response
  }

  mapToSystemAPayload(payload: PropertyPayload): SystemAPayload  {
    if(payload.type === 'Booking') {
      const data = payload.data as Booking
      const contact = data.contact as SystemAContact
      const booking = {
        venue_id: data.venueId.toString(),
        date_start: new Date(data.date),
        date_end: new Date(data.date),
        contact_id: data.contact.email 
        // Note: Contact_id is probably returned by SystemA
        // api as a response, hence should not be an email,
        // but a uuid provided by external system
        // In that case, register flow will have 2 requests in series
      } as SystemABooking
      return [contact, booking] as SystemAPayload
    } else {
      throw Error('Unknown property payload data type')
    }
  }

  private sendPayload(payload: SystemAPayload) : Promise<AxiosResponse<RegisterResponse, unknown>> {
    return api.post(`${this.url}/register`, JSON.stringify(payload), {
      headers: {
        authorization: this.jwt_token
      }
    })
  }

  public async register(payload: PropertyPayload) : Promise<AxiosResponse<RegisterResponse, unknown>> {
    const systemAPayload = this.mapToSystemAPayload(payload)
    // TODO: RETRY login when token not available -> probably session expired
    try{
      if(!this.jwt_token) {
        await this.login()
      }
      return await this.sendPayload(systemAPayload)
    } catch(e) {
      console.log(e)
      throw e
    }
  }
}
