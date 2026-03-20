export default async function handler(req, res) {
  const token = process.env.SPORTMONKS_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'SPORTMONKS_TOKEN nÃ£o configurado no servidor.' });
  }

  const date = String(req.query.date || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Data invÃ¡lida. Use YYYY-MM-DD.' });
  }

  const includeSets = [
    'participants;statistics;state;periods;odds;events',
    'participants;statistics;state;periods;events',
    'participants;state;periods;events',
    'participants;state'
  ];

  let lastError = null;

  for (const include of includeSets) {
    const url = new URL(`https://api.sportmonks.com/v3/football/fixtures/date/${date}`);
    url.searchParams.set('api_token', token);
    url.searchParams.set('include', include);

    try {
      const upstream = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json' }
      });
      const data = await upstream.json();

      if (!upstream.ok) {
        lastError = data;
        continue;
      }

      return res.status(200).json({
        source: 'sportmonks',
        include_used: include,
        fetched_at: new Date().toISOString(),
        ...data
      });
    } catch (err) {
      lastError = { error: err.message };
    }
  }

  return res.status(502).json({
    error: 'NÃ£o foi possÃ­vel consultar a Sportmonks com os includes testados.',
    details: lastError
  });
}
