import { prisma } from '@lib/prisma'

async function main() {
  await prisma.transacao.create({
    data: {
      value: 100,
      name: 'Teste',
      category: 'Linguiça',
      description: 'Teste de inserção de dados',
      type: 'entrada' 
    },
  })
}


main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })