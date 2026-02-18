export async function GET() {
  try {
    const res = await fetch('https://api.countapi.xyz/get/writethem.samstern.life/letters');
    const data = await res.json();
    return Response.json({ count: data.value || 0 });
  } catch (e) {
    return Response.json({ count: 0 });
  }
}

export async function POST() {
  try {
    const res = await fetch('https://api.countapi.xyz/hit/writethem.samstern.life/letters');
    const data = await res.json();
    return Response.json({ count: data.value || 0 });
  } catch (e) {
    return Response.json({ count: 0 });
  }
}
