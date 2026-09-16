import { z } from 'zod';

// Payload validation schema
const dasPayloadSchema = z.object({
  tenantId: z.string(),
  month: z.string().regex(/^(0[1-9]|1[0-2])$/), // MM
  year: z.string().regex(/^\d{4}$/),
});

type DasPayload = z.infer<typeof dasPayloadSchema>;

export async function generateDAS(payload: DasPayload) {
  const data = dasPayloadSchema.parse(payload);
  const baseUrl = process.env.DAS_API_BASE_URL;
  const token = process.env.DAS_API_TOKEN;
  if (!baseUrl || !token) {
    throw new Error('Missing DAS API configuration');
  }

  const response = await fetch(`${baseUrl}/das`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DAS generation failed: ${response.status} ${err}`);
  }
  return response.json(); // expected { pdfUrl, referenceId }
}

export async function generateFTG(payload: DasPayload) {
  const data = dasPayloadSchema.parse(payload);
  const baseUrl = process.env.FTG_API_BASE_URL;
  const token = process.env.FTG_API_TOKEN;
  if (!baseUrl || !token) {
    throw new Error('Missing FT‑G API configuration');
  }

  const response = await fetch(`${baseUrl}/ftg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`FT‑G generation failed: ${response.status} ${err}`);
  }
  return response.json();
}
