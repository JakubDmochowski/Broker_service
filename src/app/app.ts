import { IServer } from '../server/IServer'

export class App {
    constructor(private _server: IServer) {}

    runServer(): void {
      this._server.run(() => {
        console.log(`Server running at http://${this._server.hostname}:${this._server.port}/`)
      })
    }
}
