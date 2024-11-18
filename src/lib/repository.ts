import { PrismaClient, Transacao } from '@prisma/client';
import { z } from 'zod';

// Define o esquema de validação usando Zod
export const transacaoSchema = z.object({
  value: z.number().positive("O valor deve ser positivo."),
  name: z.string().min(1, "O nome é obrigatório."),
  category: z.string().min(1, "A categoria é obrigatória."),
  description: z.string().optional(),
  type: z.enum(["entrada", "saida"]),
});

class Repository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Criar uma transação com validação
  async createTransaction(data: Omit<z.infer<typeof transacaoSchema>, 'id' | 'date'>): Promise<unknown> {
    // Valida os dados antes de criar a transação
    const parsedData = transacaoSchema.parse(data);
    return await this.prisma.transacao.create({
      data: parsedData,
    });
  }

  // Buscar uma transação por ID
  async getTransactionById(id: string): Promise<unknown | null> {
    return await this.prisma.transacao.findUnique({
      where: { id },
    });
  }

  // Buscar todas as transações
  async getAllTransactions(): Promise<Transacao[]> {
    return await this.prisma.transacao.findMany();
  }

  // Atualizar uma transação com validação
  async updateTransaction(id: string, data: Partial<Omit<z.infer<typeof transacaoSchema>, 'id'>>): Promise<unknown | null> {
    // Valida os dados atualizados
    const parsedData = transacaoSchema.partial().parse(data);
    return await this.prisma.transacao.update({
      where: { id },
      data: parsedData,
    });
  }

  // Deletar uma transação
  async deleteTransaction(id: string): Promise<unknown | null> {
    return await this.prisma.transacao.delete({
      where: { id },
    });
  }
}

export default Repository;
