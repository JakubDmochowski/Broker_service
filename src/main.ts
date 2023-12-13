import 'dotenv/config'
import { ExpressServer } from './server/Express'
import { App } from './app/app'
import { IServer } from './server/IServer'
import { prisma } from './api/prisma'

const port = Number(process.env.PORT) || 8080;
const hostname = process.env.HOSTNAME || '127.0.0.1'
// can be extended for future use
type ServerType = 'EXPRESS'
const serverType : ServerType = (process.env.SERVER || 'EXPRESS') as ServerType 

let server : IServer
switch(serverType) {
  case 'EXPRESS':
    server = new ExpressServer(port, hostname)
    break;
  default:
    server = new ExpressServer(port, hostname)
}

async function main() {
  const app = new App(server)
  app.runServer()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
