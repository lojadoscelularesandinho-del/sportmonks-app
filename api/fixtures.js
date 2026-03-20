<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Jogos do Dia</title>
<style>
body {
background: #0b1220;
color: white;
font-family: Arial, sans-serif;
padding: 20px;
}
input, button {
padding: 10px;
border-radius: 8px;
border: none;
font-size: 16px;
}
button {
cursor: pointer;
font-weight: bold;
margin-left: 8px;
}
.card {
background: #111827;
border-radius: 12px;
padding: 12px;
margin: 10px 0;
}
.erro {
color: #ff8080;
margin-top: 12px;
}
.muted {
color: #b7c0d8;
font-size: 14px;
margin-top: 8px;
}
</style>
</head>
<body>
<h2>📊 Jogos do Dia</h2>

<input type="date" id="data">
<button onclick="buscar()">Buscar</button>

<div class="muted" id="info"></div>
<div class="erro" id="erro"></div>
<div id="res"></div>

<script>
const hoje = new Date().toISOString().split('T')[0];
document.getElementById('data').value = hoje;

async function buscar() {
const d = document.getElementById('data').value;
const erro = document.getElementById('erro');
const resBox = document.getElementById('res');
const info = document.getElementById('info');

erro.innerHTML = '';
resBox.innerHTML = 'Carregando...';
info.innerHTML = '';

try {
const r = await fetch('/api/fixtures?date=' + d);
const j = await r.json();

if (!j.ok) {
resBox.innerHTML = '';
erro.innerHTML = j.error || 'Erro ao buscar jogos.';
return;
}

info.innerHTML = 'Include usado: ' + (j.used_include || '-');

const lista = j.data || [];

if (!lista.length) {
resBox.innerHTML = '<p>Nenhum jogo encontrado.</p>';
return;
}

let html = '';
lista.forEach(x => {
const nome = x.name || 'Jogo sem nome';
const status = x.state?.name || '';
const liga = x.league_id ? 'Liga ID: ' + x.league_id : '';
const hora = x.starting_at || '';

html += `
<div class="card">
<b>${nome}</b><br>
<div>Status: ${status}</div>
<div>${hora}</div>
<div>${liga}</div>
</div>
`;
});

resBox.innerHTML = html;
} catch (e) {
resBox.innerHTML = '';
erro.innerHTML = 'Erro no navegador ao consultar a API.';
}
}
</script>
</body>
</html>
