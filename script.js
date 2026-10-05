let saldo = 0;
let valorAposta = 0;
let emJogo = false;
let bombas = [];
let acertos = 0;
let multiplicador = 1.0;
let dimensao = 5;

function tocarSom(caminho) {
  try {
    const audio = new Audio(caminho);
    audio.play().catch(() => {});
  } catch (e) {}
}

const elementoSaldo = document.getElementById("saldo");
const elementoGrade = document.getElementById("grade");
const elementoMultiplicador = document.getElementById("multiplicador");
const elementoLucroAtual = document.getElementById("lucroAtual");
const btnAcao = document.getElementById("btnAcao");
const elementoMensagem = document.getElementById("mensagem");
const inputMinas = document.getElementById("qtdMinas");
const modalGlitch = document.getElementById("modalGlitch");

function exibirModalSaldo() {
  modalGlitch.classList.add("ativo");
  tocarSom("sons/erro.mp3");
}

function fecharModalSaldo() {
  modalGlitch.classList.remove("ativo");
}

async function carregarSaldo() {
  try {
    const resposta = await fetch("/saldo");
    const dados = await resposta.json();
    saldo = dados.saldo;
    elementoSaldo.textContent = saldo.toFixed(2);
    if (saldo <= 0) {
      exibirModalSaldo();
    }
  } catch (e) {
    saldo = 100;
    elementoSaldo.textContent = saldo.toFixed(2);
  }
}

function alterarTamanhoTabuleiro() {
  if (emJogo) return;
  
  let valorSelecionado = parseInt(document.getElementById("tamanhoGrade").value);
  dimensao = Math.min(Math.max(valorSelecionado, 5), 7);
  
  const totalCasas = dimensao * dimensao;
  
  inputMinas.max = totalCasas - 1;
  if (parseInt(inputMinas.value) >= totalCasas) {
    inputMinas.value = totalCasas - 1;
  }
  
  criarGrade();
}

function criarGrade() {
  elementoGrade.innerHTML = "";
  const totalCasas = dimensao * dimensao;

  elementoGrade.style.gridTemplateColumns = `repeat(${dimensao}, minmax(40px, 56px))`;

  for (let i = 0; i < totalCasas; i++) {
    const casa = document.createElement("button");
    casa.className = "casa";
    casa.dataset.index = i;
    casa.onclick = () => clicarCasa(i);
    casa.disabled = true;
    elementoGrade.appendChild(casa);
  }
}

function gerenciarBotaoAcao() {
  if (!emJogo) {
    iniciarJogo();
  } else {
    retirarLucro();
  }
}

async function iniciarJogo() {
  const inputAposta = parseFloat(document.getElementById("valorAposta").value);
  const minasQtd = parseInt(inputMinas.value);
  const totalCasas = dimensao * dimensao;

  if (saldo <= 0 || inputAposta > saldo) {
    exibirModalSaldo();
    return;
  }

  if (isNaN(inputAposta) || inputAposta <= 0) {
    alert("Por favor, insira um valor de aposta válido.");
    return;
  }

  if (isNaN(minasQtd) || minasQtd < 1 || minasQtd >= totalCasas) {
    alert(`Escolha entre 1 e ${totalCasas - 1} maldições de Ares.`);
    return;
  }

  valorAposta = inputAposta;
  saldo -= valorAposta;
  atualizarSaldoBackend(saldo);

  bombas = [];
  while (bombas.length < minasQtd) {
    const pos = Math.floor(Math.random() * totalCasas);
    if (!bombas.includes(pos)) {
      bombas.push(pos);
    }
  }

  emJogo = true;
  acertos = 0;
  multiplicador = 1.0;
  elementoMensagem.textContent = "";

  document.getElementById("valorAposta").disabled = true;
  document.getElementById("qtdMinas").disabled = true;
  document.getElementById("tamanhoGrade").disabled = true;
  
  btnAcao.textContent = "Clamar Recompensa (Cash Out)";
  btnAcao.className = "btn-acao btn-retirar";
  btnAcao.disabled = true;

  atualizarPainel();
  criarGrade();

  document.querySelectorAll(".casa").forEach(casa => casa.disabled = false);
}

function criarEfeitoExplosao(elemento) {
  const cores = ["#ff2222", "#ff7700", "#ffcc00", "#ff0055", "#880000"];
  const qtdParticulas = 24;

  for (let i = 0; i < qtdParticulas; i++) {
    const particula = document.createElement("div");
    particula.className = "particula-explosao";

    const angulo = Math.random() * Math.PI * 2;
    const distancia = 30 + Math.random() * 50;
    const tx = Math.cos(angulo) * distancia + "px";
    const ty = Math.sin(angulo) * distancia + "px";

    particula.style.setProperty("--tx", tx);
    particula.style.setProperty("--ty", ty);
    particula.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
    
    const tamanho = 5 + Math.random() * 6;
    particula.style.width = tamanho + "px";
    particula.style.height = tamanho + "px";

    elemento.appendChild(particula);

    setTimeout(() => {
      particula.remove();
    }, 600);
  }
}

function clicarCasa(index) {
  if (!emJogo) return;

  const casas = document.querySelectorAll(".casa");
  const casaClicada = casas[index];

  if (casaClicada.innerHTML !== "") return;

  if (bombas.includes(index)) {
    // Revela a bomba como caveira
    casaClicada.innerHTML = "💀";
    casaClicada.style.fontSize = "30px";
    casaClicada.classList.add("revelado-bomba", "explosao-unica");
    criarEfeitoExplosao(casaClicada);
    tocarSom("sons/explosao.mp3");

    finalizarJogo(false);
  } else {
    // Revela a casa premiada sempre como Coroa
    casaClicada.innerHTML = "👑";
    casaClicada.style.fontSize = "30px";
    casaClicada.classList.add("revelado-reliquia");
    casaClicada.disabled = true;

    acertos++;
    multiplicador += 0.5;

    if (acertos === 1) {
      btnAcao.disabled = false;
    }

    atualizarPainel();

    const totalCasas = dimensao * dimensao;
    const totalDiamantes = totalCasas - bombas.length;
    if (acertos === totalDiamantes) {
      retirarLucro();
    }
  }
}

function retirarLucro() {
  if (!emJogo || acertos === 0) return;
  emJogo = false;

  const valorGanho = valorAposta * multiplicador;
  saldo += valorGanho;
  atualizarSaldoBackend(saldo);
  tocarSom("sons/vitoria.mp3");

  elementoMensagem.style.color = "#ffd700";
  elementoMensagem.textContent = `🏛️️ Os Deuses abençoaram sua jornada! Você ganhou ${valorGanho.toFixed(2)} dracmas!`;

  const casas = document.querySelectorAll(".casa");
  casas.forEach((casa, idx) => {
    casa.disabled = true;
    if (bombas.includes(idx)) {
      casa.innerHTML = "💀";
      casa.style.fontSize = "30px";
      casa.classList.add("revelado-bomba", "chacoalhar-bomba");
    }
  });

  btnAcao.disabled = true;

  setTimeout(() => {
    document.getElementById("valorAposta").disabled = false;
    document.getElementById("qtdMinas").disabled = false;
    document.getElementById("tamanhoGrade").disabled = false;
    
    btnAcao.textContent = "Iniciar Batalha";
    btnAcao.className = "btn-acao btn-apostar";
    btnAcao.disabled = false;

    multiplicador = 1.0;
    elementoMultiplicador.textContent = "1.0x";
    elementoLucroAtual.textContent = "0.00";
    elementoSaldo.textContent = saldo.toFixed(2);

    criarGrade();
  }, 2000);
}

function finalizarJogo(vitoria) {
  emJogo = false;

  if (!vitoria) {
    elementoMensagem.style.color = "#ff4d4d";
    elementoMensagem.textContent = `💥 A fúria de Ares o destruiu! Você perdeu ${valorAposta.toFixed(2)} dracmas!`;

    const casas = document.querySelectorAll(".casa");
    casas.forEach((casa, idx) => {
      casa.disabled = true;
      if (bombas.includes(idx) && !casa.classList.contains("revelado-bomba")) {
        casa.innerHTML = "💀";
        casa.style.fontSize = "30px";
        casa.classList.add("revelado-bomba");
      }
    });
  }

  document.getElementById("valorAposta").disabled = false;
  document.getElementById("qtdMinas").disabled = false;
  document.getElementById("tamanhoGrade").disabled = false;
  btnAcao.textContent = "Iniciar Batalha";
  btnAcao.className = "btn-acao btn-apostar";
  btnAcao.disabled = false;

  if (saldo <= 0) {
    setTimeout(exibirModalSaldo, 600);
  }
}

function atualizarPainel() {
  elementoSaldo.textContent = saldo.toFixed(2);
  elementoMultiplicador.textContent = multiplicador.toFixed(1) + "x";
  elementoLucroAtual.textContent = (valorAposta * multiplicador).toFixed(2);
}

async function atualizarSaldoBackend(novoSaldo) {
  try {
    await fetch("/saldo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ saldo: novoSaldo })
    });
  } catch (e) {}
}

// --- Gerador de Fagulhas de Fogo Subindo ---
function gerarFagulhasFundo() {
  let container = document.getElementById("fagulhas-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "fagulhas-container";
    document.body.appendChild(container);
  }

  const cores = ["#ff3300", "#ff7700", "#ffaa00", "#ff0000"];
  const quantidade = 35;

  for (let i = 0; i < quantidade; i++) {
    const fagulha = document.createElement("div");
    fagulha.className = "fagulha";
    
    fagulha.style.left = Math.random() * 100 + "vw";
    
    const duracao = 3 + Math.random() * 5;
    fagulha.style.animationDuration = duracao + "s";
    fagulha.style.animationDelay = (Math.random() * 4) + "s";
    
    const tamanho = 3 + Math.random() * 5;
    fagulha.style.width = tamanho + "px";
    fagulha.style.height = tamanho + "px";
    fagulha.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
    fagulha.style.boxShadow = `0 0 8px ${fagulha.style.backgroundColor}`;

    container.appendChild(fagulha);
  }
}

// Iniciar funções
carregarSaldo();
alterarTamanhoTabuleiro();
gerarFagulhasFundo();
