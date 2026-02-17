async function getCount() {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (!kvUrl || !kvToken) return 0;

  try {
    const res = await fetch(`${kvUrl}/get/letters_generated`, {
      headers: { Authorization: `Bearer ${kvToken}` },
    });
    const data = await res.json();
    return parseInt(data.result, 10) || 0;
  } catch (err) {
    return 0;
  }
}

async function incrementCount() {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (!kvUrl || !kvToken) return;

  try {
    await fetch(`${kvUrl}/incr/letters_generated`, {
      headers: { Authorization: `Bearer ${kvToken}` },
    });
  } catch (err) {
    // Best-effort only; ignore KV failures.
  }
}

export async function GET() {
  const count = await getCount();
  return Response.json({ count });
}

export async function POST() {
  await incrementCount();
  const count = await getCount();
  return Response.json({ count });
}
