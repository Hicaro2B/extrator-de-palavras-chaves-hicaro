import { PALAVRAS_RUINS } from "./palavrasRuins.js";

const botaoMostraPalavras = document.querySelector('#botao-palavrachave');
const ctx = document.getElementById('grafico').getContext('2d');
let grafico; // armazenar o gráfico

botaoMostraPalavras.addEventListener('click', mostraPalavrasChave);

function mostraPalavrasChave() {
  const texto = document.querySelector('#entrada-de-texto').value;
  const campoResultado = document.querySelector('#resultado-palavrachave');
  const palavrasChave = processaTexto(texto);

  if (palavrasChave.length === 0) {
    campoResultado.innerHTML = "<p>Nenhuma palavra-chave encontrada.</p>";
    if (grafico) grafico.destroy();
    return;
  }

  // Mostra em lista
  campoResultado.innerHTML = palavrasChave
    .map((p, i) => `<p><strong>${i + 1}.</strong> ${p.palavra} (${p.frequencia}x)</p>`)
    .join("");

  // Atualiza gráfico
  atualizarGrafico(palavrasChave);
}

function normalizar(palavra) {
  return palavra
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function processaTexto(texto) {
  let palavras = texto
    .split(/\P{L}+/u)
    .map(normalizar)
    .filter(p => p.length > 2);

  palavras = palavras.filter(p => !PALAVRAS_RUINS.has(p));

  const frequencias = palavras.reduce((acc, palavra) => {
    acc[palavra] = (acc[palavra] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(frequencias)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([palavra, frequencia]) => ({ palavra, frequencia }));
}

function atualizarGrafico(palavrasChave) {
  const labels = palavrasChave.map(p => p.palavra);
  const valores = palavrasChave.map(p => p.frequencia);

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: "Frequência",
        data: valores,
        backgroundColor: '#1E88E5',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { ticks: { color: "#fff" } },
        y: { ticks: { color: "#fff", stepSize: 1 } }
      }
    }
  });
}
