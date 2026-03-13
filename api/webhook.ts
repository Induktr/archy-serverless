import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const body = req.body;
    console.log('🌀 Telegram signal received:', body.message?.chat?.id);
    
    // Status Code 200 is critical for Telegram to stop retrying
    return res.status(200).send('OK');
  }

  return res.status(200).send('Archy Serverless Node is Active.');
}
