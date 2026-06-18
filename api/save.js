module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN not set' });

  // Parse body manually since Vercel doesn't auto-parse
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) { return res.status(400).json({ error: 'Invalid JSON' }); }
  }
  if (!body || !body.expenses) return res.status(400).json({ error: 'Missing data', received: typeof body });

  const apiUrl = 'https://api.github.com/repos/manuelpalomares1/finance-tracker/contents/data.json';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };

  const getRes = await fetch(apiUrl, { headers });
  if (!getRes.ok) {
    const err = await getRes.json().catch(() => ({}));
    return res.status(500).json({ error: 'Could not fetch file', status: getRes.status, detail: err.message });
  }
  const file = await getRes.json();

  const content = Buffer.from(JSON.stringify(body, null, 2)).toString('base64');
  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ message: 'Update finance data', content, sha: file.sha }),
  });

  if (!putRes.ok) {
    const err = await putRes.json().catch(() => ({}));
    return res.status(500).json({ error: 'Could not save file', status: putRes.status, detail: err.message });
  }

  res.status(200).json({ ok: true });
};
