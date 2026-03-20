export default async function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') {
return res.status(200).end();
}

const token = process.env.SPORTMONKS_TOKEN;
const date = req.query.date || new Date().toISOString().split('T')[0];

if (!token) {
return res.status(500).json({ ok: false, error: 'SPORTMONKS_TOKEN não configurado' });
}

const timezone = 'America/Sao_Paulo';
const perPage = 50;

let page = 1;
let hasMore = true;
let allData = [];

try {
while (hasMore) {
const url =
`https://api.sportmonks.com/v3/football/fixtures/date/${date}` +
`?api_token=${token}` +
`&timezone=${encodeURIComponent(timezone)}` +
`&per_page=${perPage}` +
`&page=${page}` +
`&include=state;participants`;

const response = await fetch(url);
const json = await response.json();

if (!response.ok) {
return res.status(response.status).json(json);
}

allData = allData.concat(json.data || []);
hasMore = Boolean(json.pagination?.has_more);
page += 1;
}

return res.status(200).json({
ok: true,
date,
timezone,
count: allData.length,
data: allData
});
} catch (e) {
return res.status(500).json({
ok: false,
error: 'Erro ao buscar jogos',
details: String(e)
});
}
}
