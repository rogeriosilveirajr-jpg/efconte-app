import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Multi-tenant Database (Prisma)', () => {
  beforeAll(async () => {
    // Limpar os dados antes dos testes
    await prisma.userTenant.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.tenant.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('Deve criar um Tenant (Empresa) e um Usuário vinculado', async () => {
    // 1. Cria a Empresa
    const tenant = await prisma.tenant.create({
      data: {
        name: 'Tech Contabilidade',
        cnpj: '12.345.678/0001-99',
        isAnnualContract: true,
      }
    });

    expect(tenant.id).toBeDefined();
    expect(tenant.name).toBe('Tech Contabilidade');

    // 2. Cria o Usuário já vinculado ao Tenant
    const user = await prisma.user.create({
      data: {
        email: 'dono@tech.com',
        passwordHash: 'hashsecreto123',
        role: 'CLIENTE',
        tenants: {
          create: {
            tenantId: tenant.id
          }
        }
      },
      include: {
        tenants: true
      }
    });

    expect(user.id).toBeDefined();
    expect(user.tenants).toHaveLength(1);
    expect(user.tenants[0].tenantId).toBe(tenant.id);
  });

  test('Deve adicionar um Funcionário associado ao Tenant corretamente', async () => {
    const tenant = await prisma.tenant.findUnique({
      where: { cnpj: '12.345.678/0001-99' }
    });

    const employee = await prisma.employee.create({
      data: {
        name: 'Carlos Silva',
        tenantId: tenant!.id,
      }
    });

    expect(employee.id).toBeDefined();
    expect(employee.tenantId).toBe(tenant!.id);
  });
});
