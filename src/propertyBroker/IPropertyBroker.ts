import type { Booking } from '../schema/Booking'

export type RegisterResponse = {
  errors?: Array<string>,
  message: string
}
export type DistributionResult = Promise<RegisterResponse>
export type PayloadType = 'Booking' // | 'Other' | 'Another'
export type PayloadData = Booking // | OtherData | AnotherData

// for future use, PayloadData might be later extended
export type PropertyPayload = {
  type: PayloadType,
  data: PayloadData
}

export interface IPropertyBroker {
  distribute(payload : PropertyPayload): DistributionResult
}