import { PrismaClient } from '@prisma/client';
import Repository from './repository'; 

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    transacao: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('Repository', () => {
  let repository: Repository;
  let prisma: jest.Mocked<PrismaClient>;

  beforeAll(() => {
    repository = new Repository();
    prisma = new PrismaClient() as jest.Mocked<PrismaClient>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a transaction', async () => {
    const mockData = {
      value: 150.0,
      name: 'Compra',
      category: 'Alimentação',
      description: 'Descrição opcional',
      type: 'entrada' as 'entrada' | 'saida',
    };

    const mockTransaction = { id: '1', ...mockData, date: new Date() };
    (prisma.transacao.create as jest.MockedFunction<any>).mockResolvedValue(mockTransaction);

    const result = await repository.createTransaction(mockData);
    expect(result).toEqual(mockTransaction);
    expect(prisma.transacao.create).toHaveBeenCalledWith({ data: mockData });
  });

  it('should retrieve a transaction by ID', async () => {
    const mockTransaction = {
      id: '1',
      value: 150.0,
      name: 'Compra',
      category: 'Alimentação',
      description: 'Descrição opcional',
      type: 'entrada',
      date: new Date(),
    };

    (prisma.transacao.findUnique as jest.MockedFunction<any>).mockResolvedValue(mockTransaction);

    const result = await repository.getTransactionById('1');
    expect(result).toEqual(mockTransaction);
    expect(prisma.transacao.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should return null if transaction not found', async () => {
    (prisma.transacao.findUnique as jest.MockedFunction<any>).mockResolvedValue(null);

    const result = await repository.getTransactionById('999');
    expect(result).toBeNull();
    expect(prisma.transacao.findUnique).toHaveBeenCalledWith({ where: { id: '999' } });
  });

  it('should update a transaction', async () => {
    const mockData = { value: 200.0, description: 'Atualização' };
    const mockTransaction = {
      id: '1',
      value: 200.0,
      name: 'Compra',
      category: 'Alimentação',
      description: 'Atualização',
      type: 'entrada',
      date: new Date(),
    };

    (prisma.transacao.update as jest.MockedFunction<any>).mockResolvedValue(mockTransaction);

    const result = await repository.updateTransaction('1', mockData);
    expect(result).toEqual(mockTransaction);
    expect(prisma.transacao.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: mockData,
    });
  });

  it('should delete a transaction', async () => {
    const mockTransaction = {
      id: '1',
      value: 150.0,
      name: 'Compra',
      category: 'Alimentação',
      description: 'Descrição opcional',
      type: 'entrada',
      date: new Date(),
    };

    (prisma.transacao.delete as jest.Mock).mockResolvedValue(mockTransaction);

    const result = await repository.deleteTransaction('1');
    expect(result).toEqual(mockTransaction);
    expect(prisma.transacao.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
