async function getCount() {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl}/get/letters_generated`, {
        headers: { Authorization: `Bearer ${kvToken}` },
      });
      const data = await res.json();
      return parseInt(data.result) || 0;
    } catch (e) { return 0; }
  }
  return 0;
}

async function incrementCount() {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (kvUrl && kvToken) {
    try {
      await fetch(`${kvUrl}/incr/letters_generated`, {
        headers: { Authorization: `Bearer ${kvToken}` },
      });
    } catch (e) {}
  }
}

export async function GET() {
  const c = await getCount();
  return Response.json({ count: c });
}

export async function POST() {
  await incrementCount();
  const c = await getCount();
  return Response.json({ count: c });
}
