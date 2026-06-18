module.exports = async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(200).json({ error: 'GITHUB_TOKEN not set in env' });

  const apiUrl = 'https://api.github.com/repos/manuelpalomares1/finance-tracker/contents/data.json';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const getRes = await fetch(apiUrl, { headers });
  const body = await getRes.json().catch(() => ({}));

  res.status(200).json({
    tokenPrefix: token.slice(0, 10) + '...',
    githubStatus: getRes.status,
    githubMessage: body.message || 'ok',
    hasContent: !!body.content,
  });
};
