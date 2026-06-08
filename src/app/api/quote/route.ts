import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: Send email via Resend/SendGrid, or POST to CRM webhook
  console.log('New quote submission:', body);
  return NextResponse.json({ success: true });
}
