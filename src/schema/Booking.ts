import { z } from 'zod'

export const bookingSchema = z.object({
  venueId: z.number(),
  date: z.coerce.date(),
  contact: z.object({
    email: z.string().email(),
    fullName: z.string(),
  })
})
export type Booking = z.infer<typeof bookingSchema>
