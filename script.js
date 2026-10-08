/* =========================================
   ARENA DE ARES
   JOGO DE DEMONSTRAÇÃO
========================================= */


/* =========================================
   VARIÁVEIS DO JOGADOR
========================================= */

let pontos = 100;
let emJogo = false;
let bombas = [];
let casasClicadas = [];
let acertos = 0;
let multiplicador = 1.0;
let dimensao = 6;
let quantidadeMinas = 5;
let valorApostaAtual = 10;


/* =========================================
   ELEMENTOS DO CADASTRO / LOGIN
========================================= */

const telaCadastro = document.getElementById("telaCadastro");
const formCadastro = document.getElementById("formCadastro");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const erroCadastro = document.getElementById("erroCadastro");
const btnGoogle = document.getElementById("btnGoogle");


/* =========================================
   ELEMENTOS DO JOGO
========================================= */

const jogo = document.getElementById("jogo");
const jogador = document.getElementById("jogador");
const saldo = document.getElementById("saldo");
const grade = document.getElementById("grade");
const multiplicadorTexto = document.getElementById("multiplicador");
const lucroAtual = document.getElementById("lucroAtual");
const btnAcao = document.getElementById("btnAcao");
const mensagem = document.getElementById("mensagem");
const qtdMinas = document.getElementById("qtdMinas");
const tamanhoTabuleiro = document.getElementById("tamanhoTabuleiro");
const valorAposta = document.getElementById("valorAposta");
const btnTrocarJogador = document.getElementById("btnTrocarJogador");


/* =========================================
   CADASTRO / LOGIN
========================================= */

formCadastro.addEventListener("submit", function (event) {

    event.preventDefault();

    erroCadastro.textContent = "";

    const emailValor = email.value.trim();
    const senhaValor = senha.value;

    /* -------------------------
       VALIDAR EMAIL (DOMÍNIOS PERMITIDOS)
    ------------------------- */
    const emailValido = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|icloud|yahoo|outlook)\.com(\.br)?$/i;

    if (!emailValido.test(emailValor)) {
        erroCadastro.textContent = "Use um e-mail válido (@gmail, @hotmail, @icloud, @yahoo ou @outlook).";
        email.focus();
        return;
    }

    /* -------------------------
       VALIDAR SENHA
    ------------------------- */
    if (senhaValor.length < 6) {
        erroCadastro.textContent = "A senha precisa ter pelo menos 6 caracteres.";
        senha.focus();
        return;
    }

    /* Usar o prefixo do e-mail como nome do jogador na arena */
    const usuario = emailValor.split("@")[0];

    localStorage.setItem("nomeJogador", usuario);

    jogador.textContent = `⚔️ Guerreiro: ${usuario}`;

    telaCadastro.classList.add("escondido");
    jogo.classList.remove("escondido");

    mensagem.textContent = "Escolha as configurações e comece a rodada!";

    atualizarInterface();

});


/* =========================================
   ENTRAR COM GOOGLE (PREENCHIMENTO AUTOMÁTICO)
========================================= */

btnGoogle.addEventListener("click", function () {
    const emailSalvo = localStorage.getItem("nomeJogador");

    if (emailSalvo) {
        email.value = `${emailSalvo}@gmail.com`;
    } else {
        email.value = "gabriel.riquieri2011@gmail.com";
    }

    senha.value = "123456";
    erroCadastro.textContent = "";
});


/* =========================================
   VERIFICAR JOGADOR SALVO
========================================= */

function verificarJogador() {

    const jogadorSalvo = localStorage.getItem("nomeJogador");

    if (jogadorSalvo) {
        jogador.textContent = `⚔️ Guerreiro: ${jogadorSalvo}`;
        telaCadastro.classList.add("escondido");
        jogo.classList.remove("escondido");
        atualizarInterface();
    } else {
        telaCadastro.classList.remove("escondido");
        jogo.classList.add("escondido");
    }

}


/* =========================================
   TROCAR JOGADOR
========================================= */

btnTrocarJogador.addEventListener("click", function () {
    localStorage.removeItem("nomeJogador");
    formCadastro.reset();
    erroCadastro.textContent = "";
    jogo.classList.add("escondido");
    telaCadastro.classList.remove("escondido");
});


/* =========================================
   ATUALIZAR INTERFACE
========================================= */

function atualizarInterface() {
    saldo.textContent = pontos;
    multiplicadorTexto.textContent = multiplicador.toFixed(1) + "x";
    
    // Pontos da rodada calculados com base no valor apostado e multiplicador
    const lucro = emJogo ? Math.floor(valorApostaAtual * multiplicador) : 0;
    lucroAtual.textContent = lucro;
}


/* =========================================
   ALTERAR TAMANHO DO TABULEIRO
========================================= */

tamanhoTabuleiro.addEventListener("change", function () {
    if (emJogo) {
        mensagem.textContent = "Termine a rodada antes de mudar o tabuleiro.";
        return;
    }

    dimensao = Number(tamanhoTabuleiro.value);
    criarTabuleiroVazio();
});


/* =========================================
   CRIAR TABULEIRO VAZIO
========================================= */

function criarTabuleiroVazio() {

    grade.innerHTML = "";
    grade.style.gridTemplateColumns = `repeat(${dimensao}, 1fr)`;

    const total = dimensao * dimensao;

    for (let i = 0; i < total; i++) {
        const casa = document.createElement("button");
        casa.classList.add("casa");
        casa.type = "button";
        casa.textContent = "?";
        casa.disabled = true;
        grade.appendChild(casa);
    }

}


/* =========================================
   COMEÇAR / FINALIZAR RODADA
========================================= */

btnAcao.addEventListener("click", function () {
    if (!emJogo) {
        iniciarJogo();
    } else if (acertos > 0) {
        encerrarRodadaComSucesso();
    }
});

function iniciarJogo() {

    const apostaDesejada = Number(valorAposta.value);

    if (isNaN(apostaDesejada) || apostaDesejada <= 0) {
        mensagem.textContent = "Digite uma quantia válida para a aposta.";
        return;
    }

    if (apostaDesejada > pontos) {
        mensagem.textContent = "Você não possui pontos suficientes para essa aposta.";
        return;
    }

    quantidadeMinas = Number(qtdMinas.value);
    dimensao = Number(tamanhoTabuleiro.value);

    const totalCasas = dimensao * dimensao;

    if (quantidadeMinas >= totalCasas) {
        mensagem.textContent = "A quantidade de minas é muito alta.";
        return;
    }

    valorApostaAtual = apostaDesejada;
    pontos -= valorApostaAtual;
    
    emJogo = true;
    bombas = [];
    casasClicadas = [];
    acertos = 0;
    multiplicador = 1.0;

    /* Criar minas */
    while (bombas.length < quantidadeMinas) {
        const numero = Math.floor(Math.random() * totalCasas);
        if (!bombas.includes(numero)) {
            bombas.push(numero);
        }
    }

    criarTabuleiro();

    // Bloqueia a alteração dos campos durante a rodada
    valorAposta.disabled = true;
    qtdMinas.disabled = true;
    tamanhoTabuleiro.disabled = true;

    // Altera o botão para Finalizar, mas DESATIVADO até clicar em uma casa
    btnAcao.textContent = "💰 ENCERRAR RODADA";
    btnAcao.disabled = true;

    mensagem.textContent = "Escolha uma casa da arena!";

    atualizarInterface();

}


/* =========================================
   CRIAR TABULEIRO
========================================= */

function criarTabuleiro() {

    grade.innerHTML = "";
    grade.style.gridTemplateColumns = `repeat(${dimensao}, 1fr)`;

    const total = dimensao * dimensao;

    for (let i = 0; i < total; i++) {
        const casa = document.createElement("button");
        casa.classList.add("casa");
        casa.type = "button";
        casa.dataset.index = i;
        casa.textContent = "?";

        casa.addEventListener("click", function () {
            clicarCasa(i, casa);
        });

        grade.appendChild(casa);
    }

}


/* =========================================
   CLICAR EM CASA
========================================= */

function clicarCasa(indice, casa) {

    if (!emJogo) {
        return;
    }

    if (casasClicadas.includes(indice)) {
        return;
    }

    casasClicadas.push(indice);

    /* BOMBA */
    if (bombas.includes(indice)) {
        casa.textContent = "💣";
        casa.classList.add("bomba");
        revelarBombas();
        emJogo = false;
        
        liberarCampos();
        btnAcao.textContent = "⚔️ COMEÇAR RODADA";
        btnAcao.disabled = false;

        mensagem.textContent = "💥 Você encontrou uma mina! Perdeu a aposta.";
        multiplicador = 1.0;
        atualizarInterface();
        return;
    }

    /* CASA SEGURA */
    acertos++;
    multiplicador += 0.2;

    casa.textContent = "⚔️";
    casa.classList.add("segura");
    casa.classList.add("desativada");

    // Habilita o botão de encerrar a partir do primeiro acerto!
    btnAcao.disabled = false;

    mensagem.textContent = `⚔️ Acerto! Multiplicador subiu para ${multiplicador.toFixed(1)}x.`;

    atualizarInterface();

    /* VERIFICAR VITÓRIA */
    const totalCasas = dimensao * dimensao;
    if (acertos >= totalCasas - quantidadeMinas) {
        finalizarVitoria();
    }

}


/* =========================================
   REVELAR BOMBAS
========================================= */

function revelarBombas() {

    const casas = document.querySelectorAll(".casa");

    bombas.forEach(function (indice) {
        const casa = casas[indice];
        if (!casa) {
            return;
        }
        casa.textContent = "💣";
        casa.classList.add("bomba");
        casa.classList.add("desativada");
    });

}


/* =========================================
   ENCERRAR RODADA (RETIRAR GANHOS)
========================================= */

function encerrarRodadaComSucesso() {
    if (!emJogo || acertos === 0) return;

    emJogo = false;
    const premio = Math.floor(valorApostaAtual * multiplicador);
    pontos += premio;

    revelarBombas();
    liberarCampos();

    btnAcao.textContent = "⚔️ COMEÇAR RODADA";
    btnAcao.disabled = false;

    mensagem.textContent = `💰 Você encerrou a rodada e garantiu ${premio} pontos!`;

    atualizarInterface();
}


/* =========================================
   VITÓRIA COMPLETA
========================================= */

function finalizarVitoria() {

    emJogo = false;
    const premio = Math.floor(valorApostaAtual * multiplicador);
    pontos += premio;

    liberarCampos();

    btnAcao.textContent = "⚔️ COMEÇAR RODADA";
    btnAcao.disabled = false;

    mensagem.textContent = `🏆 VITÓRIA TOTAL! Você limpou a arena e ganhou ${premio} pontos!`;

    revelarBombas();
    atualizarInterface();

}


/* =========================================
   LIBERAR CAMPOS DE CONFIGURAÇÃO
========================================= */

function liberarCampos() {
    valorAposta.disabled = false;
    qtdMinas.disabled = false;
    tamanhoTabuleiro.disabled = false;
}


/* =========================================
   INICIALIZAÇÃO
========================================= */

verificarJogador();
criarTabuleiroVazio();
atualizarInterface();
