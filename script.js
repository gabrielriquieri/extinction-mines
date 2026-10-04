let saldo = 0;
let valorAposta = 0;
let emJogo = false;
let bombas = [];
let acertos = 0;
let multiplicador = 1.0;
let dimensao = 5;

// Caminhos para a pasta /imagens (com imagem local ou fallback online)
const animaisExtincao = [
  { nome: "Mico-leão-dourado", url: "imagens/mico-leao.jpg", fallbackUrl: "https://images.unsplash.com/photo-1540573133985-7523134d2185?auto=format&fit=crop&w=150&q=80", fallbackEmoji: "🐒" },
  { nome: "Onça-pintada", url: "imagens/onca.jpg", fallbackUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=150&q=80", fallbackEmoji: "🐆" },
  { nome: "Arara-azul", url: "imagens/arara.jpg", fallbackUrl: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=150&q=80", fallbackEmoji: "🦜" },
  { nome: "Lobo-guará", url: "imagens/lobo.jpg", fallbackUrl: "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=150&q=80", fallbackEmoji: "🦊" },
  { nome: "Tartaruga-marinha", url: "imagens/tartaruga.jpg", fallbackUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=150&q=80", fallbackEmoji: "🐢" },
  { nome: "Tamanduá-bandeira", url: "imagens/tamandua.jpg", fallbackUrl: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=150&q=80", fallbackEmoji: "🦥" }
];

// Instâncias de som da pasta /sons (opcionais, tratadas para não quebrar o script se o arquivo não existir)
function tocarSom(caminho) {
  try {
    const audio = new Audio(caminho);
    audio.play().catch(() => {});
  } catch (e) {
    // Ignora se o áudio não estiver carregado
  }
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
    console.warn("Backend /saldo não encontrado, usando saldo padrão inicial.");
    saldo = 100;
    elementoSaldo.textContent = saldo.toFixed(2);
  }
}

function alterarTamanhoTabuleiro() {
  if (emJogo) return;
  dimensao = parseInt(document.getElementById("tamanhoGrade").value);
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

  elementoGrade.style.gridTemplateColumns = `repeat(${dimensao}, 56px)`;

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
    alert(`Escolha entre 1 e ${totalCasas - 1} minas.`);
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
  
  btnAcao.textContent = "Retirar (Cash Out)";
  btnAcao.className = "btn-acao btn-retirar";
  btnAcao.disabled = true;

  atualizarPainel();
  criarGrade();

  document.querySelectorAll(".casa").forEach(casa => casa.disabled = false);
}

function criarEfeitoExplosao(elemento) {
  const cores = ["#ff4d4d", "#ff9900", "#ffff00", "#ff1a1a", "#555555"];
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
    casaClicada.textContent = "💣";
    casaClicada.classList.add("revelado-bomba", "explosao-unica");
    criarEfeitoExplosao(casaClicada);
    tocarSom("sons/explosao.mp3");

    finalizarJogo(false);
  } else {
    const animal = animaisExtincao[Math.floor(Math.random() * animaisExtincao.length)];
    
    const img = document.createElement("img");
    img.src = animal.url;
    img.alt = animal.nome;
    img.title = animal.nome;
    
    // Fallback caso a imagem local não esteja na pasta /imagens
    img.onerror = function() {
      this.onerror = function() {
        casaClicada.innerHTML = animal.fallbackEmoji;
        casaClicada.style.fontSize = "30px";
      };
      this.src = animal.fallbackUrl;
    };

    casaClicada.appendChild(img);
    casaClicada.classList.add("revelado-animal");
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

  elementoMensagem.style.color = "#85e085";
  elementoMensagem.textContent = `🎉 Você resgatou os animais e retirou ${valorGanho.toFixed(2)} moedas!`;

  const casas = document.querySelectorAll(".casa");
  casas.forEach((casa, idx) => {
    casa.disabled = true;
    if (bombas.includes(idx)) {
      casa.textContent = "💣";
      casa.classList.add("revelado-bomba", "chacoalhar-bomba");
    }
  });

  btnAcao.disabled = true;

  setTimeout(() => {
    document.getElementById("valorAposta").disabled = false;
    document.getElementById("qtdMinas").disabled = false;
    document.getElementById("tamanhoGrade").disabled = false;
    
    btnAcao.textContent = "Começar Jogo";
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
    elementoMensagem.textContent = `💥 Você pisou em uma mina e perdeu ${valorAposta.toFixed(2)} moedas!`;

    const casas = document.querySelectorAll(".casa");
    casas.forEach((casa, idx) => {
      casa.disabled = true;
      if (bombas.includes(idx) && !casa.classList.contains("revelado-bomba")) {
        casa.textContent = "💣";
        casa.classList.add("revelado-bomba");
      }
    });
  }

  document.getElementById("valorAposta").disabled = false;
  document.getElementById("qtdMinas").disabled = false;
  document.getElementById("tamanhoGrade").disabled = false;
  btnAcao.textContent = "Começar Jogo";
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
  } catch (e) {
    // Modo offline/sem backend ativo
  }
}

carregarSaldo();
alterarTamanhoTabuleiro();
