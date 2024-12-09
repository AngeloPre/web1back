import Repository from '@lib/repository';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';


const repository = new Repository();

export async function transactionController(fastify: FastifyInstance) {
  // Criar uma nova transação
  fastify.post('/transactions', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const bodySchema = z.object({
        value: z.number(),
        name: z.string(),
        category: z.string(),
        description: z.string().optional(),
        type: z.enum(['entrada', 'saida']),
      });

      const body = bodySchema.parse(request.body);
      const newTransaction = await repository.createTransaction(body);
      return reply.status(201).send(newTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Erro de validação', details: error.errors });
      }
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  });


  // Buscar uma transação por ID
  fastify.get('/transactions/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const paramsSchema = z.object({
        id: z.string(),
      });

      const params = paramsSchema.parse(request.params);
      const transaction = await repository.getTransactionById(params.id);

      if (!transaction) {
        return reply.status(404).send({ error: 'Transação não encontrada' });
      }
      return reply.status(200).send(transaction);
    } catch (error) {
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  });

  // Buscar todas as transações
    fastify.get('/transactions', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
        const transactions = await repository.getAllTransactions();
        return reply.status(200).send(transactions);
        } catch (error) {
        return reply.status(500).send({ error: 'Erro interno do servidor' });
        }
    });


  // Atualizar uma transação
  fastify.put('/transactions/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const paramsSchema = z.object({
        id: z.string(),
      });

      const bodySchema = z.object({
        value: z.number().optional(),
        name: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        type: z.enum(['entrada', 'saida']).optional(),
      });

      const params = paramsSchema.parse(request.params);
      const body = bodySchema.parse(request.body);

      const updatedTransaction = await repository.updateTransaction(params.id, body);

      if (!updatedTransaction) {
        return reply.status(404).send({ error: 'Transação não encontrada' });
      }
      return reply.status(200).send(updatedTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Erro de validação', details: error.errors });
      }
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  });

  // Deletar uma transação
  fastify.delete('/transactions/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const paramsSchema = z.object({
        id: z.string(),
      });

      const params = paramsSchema.parse(request.params);
      const deletedTransaction = await repository.deleteTransaction(params.id);

      if (!deletedTransaction) {
        return reply.status(404).send({ error: 'Transação não encontrada' });
      }
      return reply.status(200).send(deletedTransaction);
    } catch (error) {
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  });
}
