export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: { message: 'API key not configured' } }, { status: 500 });
  }
  try {
    const body = await request.json();
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: body.model || 'claude-sonnet-4-20250514',
        max_tokens: body.max_tokens || 1000,
        system: body.system || '',
        messages: body.messages || [],
      }),
    });
    const data = await response.json();

    if (data.content && !data.error) {
      try {
        const base = 'https://api.countapi.xyz';
        const ns = 'writethem-samstern-life';
        const key = 'letters_generated';
        await fetch(`${base}/hit/${ns}/${key}`);
      } catch (err) {
        // Best-effort only; ignore counter failures.
      }
    }

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: { message: err.message } }, { status: 500 });
  }
}
