import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const count = await kv.get('letters_generated') || 0;
    return Response.json({ count });
  } catch (err) {
    return Response.json({ count: 0 });
  }
}
