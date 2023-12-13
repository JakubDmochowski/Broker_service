import { IServer } from './IServer'
import express, { Express, Request, Response } from 'express'
import { z } from 'zod'
import { bookingSchema } from '../schema/Booking';
import { PropertyBroker } from '../propertyBroker/PropertyBroker'
import type { IPropertyBroker } from '../propertyBroker/IPropertyBroker'


export class ExpressServer implements IServer {
    constructor(
        public readonly port: number,
        public readonly hostname: string,
        private _instance : Express = express(),
        private _propertyBroker : IPropertyBroker = PropertyBroker.getInstance()
    ) {
        this.setupMiddleware()
        this.setupRoutes()
    }
    setupMiddleware() : void {
        this._instance.use(express.json())
    }

    setupRoutes() : void {
        this._instance.post('/registerBooking', (req: Request, res: Response) => {
            try {
                const booking = bookingSchema.parse(req.body)
                const distributePayload = {
                    type: 'Booking' as const,
                    data: booking
                }

                this._propertyBroker
                    .distribute(distributePayload)
                    .then((results) => {
                        res.status(200).end(results.message)
                    })
                    .catch((error) => {
                        res.status(400).end(error.message)
                    })
            } catch(e) {
                if (e instanceof z.ZodError) {
                    console.log(e.issues);
                    res.status(400).end(e.issues);
                }
            }
        })
    }
    public run(callback: (() => void) | undefined) {
        this._instance.listen(this.port, this.hostname, callback)
    }
}