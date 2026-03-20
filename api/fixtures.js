export default async function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*');

const token = process.env.SPORTMONKS_TOKEN;
const date = req.query.date || new Date().toISOString().split('T')[0];

try {
const url = `https://api.sportmonks.com/v3/football/fixtures/date/${date}?api_token=${token}`;

const response = await fetch(url);
const data = await response.json();

return res.status(200).json(data);

} catch (e) {
return res.status(500).json({ error: 'Erro ao buscar jogos' });
}
}
