export const runtime = "edge";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { generateDAS } from '@/lib/billing';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // In a real scenario, you'd also check if the requested tenantId belongs to the user
    // if session.user.role !== 'ADMIN'

    const payload = await request.json() as any;
    const result = await generateDAS(payload);
    return NextResponse.json(result);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
