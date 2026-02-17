const COUNTAPI_BASE = 'https://api.countapi.xyz';
const COUNTAPI_NAMESPACE = 'writethem-samstern-life';
const COUNTAPI_KEY = 'letters_generated';

async function getCount() {
  try {
    const res = await fetch(
      `${COUNTAPI_BASE}/get/${COUNTAPI_NAMESPACE}/${COUNTAPI_KEY}`,
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return parseInt(data.value, 10) || 0;
  } catch (err) {
    return 0;
  }
}

async function incrementCount() {
  try {
    await fetch(`${COUNTAPI_BASE}/hit/${COUNTAPI_NAMESPACE}/${COUNTAPI_KEY}`);
  } catch (err) {
    // Best-effort only; ignore counter failures.
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
