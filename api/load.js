module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const token = process.env.GITHUB_TOKEN;
  const apiUrl = 'https://api.github.com/repos/manuelpalomares1/finance-tracker/contents/data.json';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const getRes = await fetch(apiUrl, { headers });
  if (!getRes.ok) return res.status(500).json({ error: 'Could not load data' });

  const file = await getRes.json();
  const data = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(data);
}
