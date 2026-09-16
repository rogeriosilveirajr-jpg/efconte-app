import { generateDAS } from '../src/lib/billing';
import { z } from 'zod';

// Configurando um ambiente falso para o teste
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
  global.fetch = jest.fn();
});

afterAll(() => {
  process.env = originalEnv;
});

describe('billing.ts - generateDAS()', () => {
  test('Deve lançar erro de validação (Zod) se o mês for inválido', async () => {
    // Mês '13' é inválido
    await expect(generateDAS({
      tenantId: '123',
      month: '13',
      year: '2026'
    })).rejects.toThrow(z.ZodError);
  });

  test('Deve lançar erro de validação (Zod) se o ano for inválido', async () => {
    // Ano com 2 dígitos é inválido
    await expect(generateDAS({
      tenantId: '123',
      month: '09',
      year: '26'
    })).rejects.toThrow(z.ZodError);
  });

  test('Deve lançar erro se a configuração da API estiver faltando', async () => {
    // Garantindo que não tenha configuração
    delete process.env.DAS_API_BASE_URL;
    delete process.env.DAS_API_TOKEN;

    await expect(generateDAS({
      tenantId: '123',
      month: '09',
      year: '2026'
    })).rejects.toThrow('Missing DAS API configuration');
  });

  test('Deve chamar o fetch corretamente e retornar os dados quando sucesso', async () => {
    process.env.DAS_API_BASE_URL = 'http://api-fake.com';
    process.env.DAS_API_TOKEN = 'token-secreto';

    const mockResponse = { pdfUrl: 'http://fake.com/boleto.pdf', referenceId: 'ref-123' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    const result = await generateDAS({
      tenantId: '123',
      month: '09',
      year: '2026'
    });

    expect(global.fetch).toHaveBeenCalledWith('http://api-fake.com/das', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-secreto',
      },
      body: JSON.stringify({ tenantId: '123', month: '09', year: '2026' }),
    });

    expect(result).toEqual(mockResponse);
  });
});
