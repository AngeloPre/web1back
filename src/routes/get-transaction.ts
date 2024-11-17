import { prisma } from "@lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function getTransacao(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/transacoes/:transacaoId', {
        schema: {
            params: z.object({
                transacaoId: z.string().uuid(), // Validação do ID como UUID
            }),
            response: {
                200: {
                    transacao: z.object({
                        id: z.string().uuid(),
                        value: z.number(),
                        name: z.string(),
                        category: z.string(),
                        description: z.string().nullable(),
                        date: z.string().datetime(),
                        type: z.enum(["entrada", "saida"]), // Validação do tipo
                    }),
                },
            },
        },
    }, async (request, reply) => {
        const { transacaoId } = request.params;

        // Busca da transação pelo ID no Prisma
        const transacao = await prisma.transacao.findUnique({
            select: {
                id: true,
                value: true,
                name: true,
                category: true,
                description: true,
                date: true,
                type: true,
            },
            where: {
                id: transacaoId,
            },
        });

        // Retorna erro caso a transação não seja encontrada
        if (transacao === null) {
            return reply.status(404).send({ error: 'Transação não encontrada.' });
        }

        // Resposta com os dados da transação
        return reply.send({ transacao });
    });
}
