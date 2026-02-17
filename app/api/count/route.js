function getKvConfig() {
  const kvUrl =
    process.env.KV_REST_API_URL ||
    process.env.KV_REST_API_REDIS_URL ||
    process.env.KV_REST_API_REST_URL;
  const kvToken =
    process.env.KV_REST_API_TOKEN ||
    process.env.KV_REST_API_REDIS_TOKEN ||
    process.env.KV_REST_API_REST_TOKEN;

  if (!kvUrl || !kvToken) return null;
  return { kvUrl, kvToken };
}

async function getCount() {
  const config = getKvConfig();
  if (!config) return 0;

  try {
    const res = await fetch(`${config.kvUrl}/get/letters_generated`, {
      headers: { Authorization: `Bearer ${config.kvToken}` },
    });
    const data = await res.json();
    return parseInt(data.result, 10) || 0;
  } catch (err) {
    return 0;
  }
}

async function incrementCount() {
  const config = getKvConfig();
  if (!config) return;

  try {
    await fetch(`${config.kvUrl}/incr/letters_generated`, {
      headers: { Authorization: `Bearer ${config.kvToken}` },
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
