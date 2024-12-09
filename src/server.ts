import fastify from 'fastify';
import fastifyCors from '@fastify/cors'; // Import Fastify CORS plugin
import { transactionController } from './controllers/transactionController'; // Ajuste o caminho conforme necessário
import { generateAICompletionRoute } from '@routes/generate-ai-completion';

const app = fastify({ logger: true });

async function main() {
  // Enable CORS
  app.register(fastifyCors, {
    origin: 'http://localhost:5173', // Allow requests from the frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  });

  // Register the controller
  app.register(transactionController);
  app.register(generateAICompletionRoute);

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
