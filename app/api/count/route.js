export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COUNTAPI_BASE = 'https://api.countapi.xyz';
const COUNTAPI_NAMESPACE = 'writethem-samstern-life';
const COUNTAPI_KEY = 'letters_generated';

export async function GET() {
  try {
    const res = await fetch(
      `${COUNTAPI_BASE}/get/${COUNTAPI_NAMESPACE}/${COUNTAPI_KEY}`,
      { cache: 'no-store' },
    );
    const data = await res.json();
    return Response.json(
      { count: data.value || 0 },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  } catch (e) {
    return Response.json(
      { count: 0 },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
}

export async function POST() {
  try {
    const res = await fetch(
      `${COUNTAPI_BASE}/hit/${COUNTAPI_NAMESPACE}/${COUNTAPI_KEY}`,
      { cache: 'no-store' },
    );
    const data = await res.json();
    return Response.json(
      { count: data.value || 0 },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  } catch (e) {
    return Response.json(
      { count: 0 },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
}
