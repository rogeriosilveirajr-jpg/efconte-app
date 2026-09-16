import { NextResponse } from 'next/server';
import { generateDAS } from '@/lib/billing';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await generateDAS(payload);
    return NextResponse.json(result);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
