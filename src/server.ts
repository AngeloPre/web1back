import fastify from 'fastify';
import cors from '@fastify/cors'; // Import Fastify CORS plugin
import { transactionController } from './controllers/transactionController'; // Ajuste o caminho conforme necessário

const app = fastify({ logger: true });

async function main() {
  // Enable CORS
  app.register(cors, {
    origin: 'http://localhost:5173', // Allow requests from the frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  });

  // Register the controller
  app.register(transactionController);

  // Start the server
  try {
    await app.listen({ port: 3333 });
    app.log.info(`Servidor rodando em: http://localhost:3333`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
