import fastify from 'fastify';
import { transactionController } from './controllers/transactionController'; // Ajuste o caminho conforme necessário

const app = fastify({ logger: true });

async function main() {
  // Registra o controller
  app.register(transactionController);

  // Inicia o servidor
  try {
    await app.listen({ port: 3333 });
    app.log.info(`Servidor rodando em: http://localhost:3333`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
