import { IPropertyBroker, PropertyPayload, DistributionResult } from './IPropertyBroker'
import { prisma } from '../api/prisma'
import { SystemA } from '../systems/SystemA'
import { SystemB } from '../systems/SystemB'
import type { AxiosResponse } from 'axios'
import type { RegisterResponse } from './IPropertyBroker'


export class PropertyBroker implements IPropertyBroker {
  private static instance : PropertyBroker;

  private constructor() {}

  public static getInstance(): PropertyBroker {
    if(!PropertyBroker.instance) {
      PropertyBroker.instance = new PropertyBroker()
    }
    return PropertyBroker.instance
  }

  public async distribute(payload: PropertyPayload): DistributionResult {
    console.log(`Distributing payload: ${JSON.stringify(payload)}`)
    try{
      // TODO: Make dependency injection for ORM
      const venue = await prisma.venue.findFirstOrThrow({
        where: {
          id: payload.data.venueId 
        }
      })
      let response : AxiosResponse<RegisterResponse, unknown>
      switch(venue.system){
        case 'SYSTEMA':
          response = await SystemA.getInstance().register(payload)
          console.log(`SystemA response for register: ${JSON.stringify(response.data)}`)
          return response.data
        case 'SYSTEMB':
          response = await SystemB.getInstance().register(payload)
          console.log(`SystemB response for register: ${response}`)
          return response.data
        default:
          throw new Error('Venue System not found.')
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}
