import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    console.log('🌀 Incoming signal from Telegram:', body.message?.chat?.id);

    // 1. Logic to hand over the message to the Neural Bridge (Archy Negotiator)
    // 2. Here we will trigger a background job to process the response.

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
