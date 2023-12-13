import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.venue.createMany({
    data: [
      {system: 'SYSTEMA'},
      {system: 'SYSTEMA'},
      {system: 'SYSTEMB'},
      {system: 'SYSTEMB'},
    ]
  })
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