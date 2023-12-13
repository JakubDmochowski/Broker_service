import { api } from '../api/axios'
import { AxiosResponse } from 'axios'
import { System } from './index'
import type { PropertyPayload, RegisterResponse } from '../propertyBroker/IPropertyBroker'

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
// can be extended if properties have more than just Booking data type
type SystemBPayload = SystemBBooking

export class SystemB extends System {
  protected static instance: SystemB;
  protected url: string = 'http://127.0.0.1:3002';

  private constructor() {
    super()
  }

  private static GetCredentials() : SystemBCredentials {
    // store and get from the database if needed, for mock purposes we use env variables
    return {
      apiKey: process.env.SYSTEM_B_APIKEY,
      clientId: process.env.SYSTEM_B_CLIENT_ID
    } as SystemBCredentials
  }
  
  mapToSystemBPayload(payload: PropertyPayload): SystemBPayload  {
    if(payload.type === 'Booking') {
      return payload.data as SystemBBooking
    } else {
      throw Error('Unknown property payload data type')
    }
  }

  public static getInstance(): SystemB {
    if(!this.instance) {
      this.instance = new SystemB()
    }
    return this.instance
  }

  public async register(payload: PropertyPayload) : Promise<AxiosResponse<RegisterResponse, unknown>> {
    console.log(`SystemB: register(payload: ${payload})`)
    const systemBPayload = this.mapToSystemBPayload(payload)
    
    return await api.post(`${this.url}/register`, systemBPayload, { 
      headers: {
        authorization: JSON.stringify(SystemB.GetCredentials())
      }
    })
  }
}
