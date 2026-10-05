```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Arena de Ares</title>

<style>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    color: white;
    background:
        radial-gradient(circle at center, #351000 0%, #120400 45%, #050000 100%);
    overflow-x: hidden;
}

/* =========================
   TELA DE CADASTRO
========================= */

.tela-cadastro {
    position: fixed;
    inset: 0;
    z-index: 9999;

    display: flex;
    justify-content: center;
    align-items: center;

    background:
        radial-gradient(circle, #4b1700, #090000 70%);

    backdrop-filter: blur(8px);
}

.card-cadastro {
    width: min(90%, 430px);
    padding: 40px;

    text-align: center;

    background: rgba(20, 8, 2, 0.97);
    border: 2px solid #ff7700;
    border-radius: 20px;

    box-shadow:
        0 0 30px #ff3300,
        inset 0 0 25px rgba(255, 100, 0, 0.15);
}

.card-cadastro h1 {
    margin-top: 0;
    color: #ffd700;
    font-size: 32px;
    text-shadow: 0 0 15px #ff7700;
}

.card-cadastro p {
    color: #ddd;
}

.card-cadastro input {
    width: 100%;
    padding: 15px;
    margin: 20px 0;

    border: 2px solid #ff7700;
    border-radius: 10px;

    background: #120805;
    color: white;

    font-size: 16px;
    outline: none;
}

.card-cadastro input:focus {
    border-color: #ffd700;
    box-shadow: 0 0 12px #ff7700;
}

.card-cadastro button {
    width: 100%;
    padding: 15px;

    border: none;
    border-radius: 10px;

    background: linear-gradient(90deg, #ff3300, #ff9900);
    color: white;

    font-size: 16px;
    font-weight: bold;

    cursor: pointer;
    transition: 0.2s;
}

.card-cadastro button:hover {
    transform: scale(1.03);
    box-shadow: 0 0 20px #ff6600;
}

.erro {
    color: #ff4444 !important;
    min-height: 20px;
}

.escondido {
    display: none !important;
}

/* =========================
   JOGO
========================= */

.container {
    width: min(1100px, 95%);
    margin: auto;
    padding: 30px 0;
}

header {
    text-align: center;
    margin-bottom: 25px;
}

header h1 {
    margin: 0;
    color: #ffd700;
    font-size: clamp(32px, 6vw, 55px);
    text-shadow:
        0 0 10px #ff6600,
        0 0 25px #ff3300;
}

header p {
    color: #ddd;
}

/* PAINEL */

.painel {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-bottom: 25px;
}

.info {
    padding: 18px;
    text-align: center;

    background: rgba(30, 10, 0, 0.9);
    border: 1px solid #ff7700;
    border-radius: 12px;

    box-shadow: 0 0 10px rgba(255, 70, 0, 0.3);
}

.info span {
    display: block;
    color: #aaa;
    font-size: 14px;
}

.info strong {
    display: block;
    margin-top: 5px;
    color: #ffd700;
    font-size: 25px;
}

/* CONTROLES */

.controles {
    display: flex;
    justify-content: center;
    align-items: end;
    flex-wrap: wrap;
    gap: 15px;

    margin-bottom: 25px;
}

.controle {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.controle label {
    color: #ddd;
    font-size: 14px;
}

.controle input,
.controle select {
    padding: 12px;

    border: 1px solid #ff7700;
    border-radius: 8px;

    background: #150805;
    color: white;

    outline: none;
}

.btn-acao {
    padding: 13px 25px;

    border: none;
    border-radius: 8px;

    color: white;
    font-weight: bold;

    cursor: pointer;
    transition: 0.2s;
}

.btn-apostar {
    background: linear-gradient(90deg, #ff3300, #ff8800);
}

.btn-retirar {
    background: linear-gradient(90deg, #008c3a, #00c853);
}

.btn-acao:hover:not(:disabled) {
    transform: scale(1.04);
    box-shadow: 0 0 15px currentColor;
}

.btn-acao:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* MENSAGEM */

#mensagem {
    min-height: 28px;
    margin: 15px 0;

    text-align: center;
    font-weight: bold;
    font-size: 17px;
}

/* =========================
   TABULEIRO
========================= */

.area-grade {
    display: flex;
    justify-content: center;
    width: 100%;
    overflow-x: auto;
    padding: 15px;
}

#grade {
    display: grid;
    gap: 8px;
    justify-content: center;
}

.casa {
    width: 56px;
    height: 56px;

    border: 2px solid #ff7700;
    border-radius: 10px;

    background:
        linear-gradient(145deg, #321000, #150500);

    color: white;

    cursor: pointer;

    font-size: 25px;

    box-shadow:
        inset 0 0 10px rgba(255, 100, 0, 0.2),
        0 0 5px rgba(255, 70, 0, 0.3);

    transition: 0.15s;
}

.casa:hover:not(:disabled) {
    transform: scale(1.06);
    border-color: #ffd700;
    box-shadow: 0 0 15px #ff7700;
}

.casa:disabled {
    cursor: default;
}

.revelado-reliquia {
    background: linear-gradient(145deg, #806000, #3d2d00);
    border-color: #ffd700;
    box-shadow: 0 0 15px #ffd700;
}

.revelado-bomba {
    background: linear-gradient(145deg, #700000, #210000);
    border-color: #ff2222;
    box-shadow: 0 0 20px #ff0000;
}

/* =========================
   EXPLOSÃO
========================= */

.particula-explosao {
    position: absolute;

    pointer-events: none;

    border-radius: 50%;

    animation: explosao 0.6s forwards;
}

@keyframes explosao {
    0% {
        opacity: 1;
        transform: translate(0, 0) scale(1);
    }

    100% {
        opacity: 0;
        transform: translate(var(--tx), var(--ty)) scale(0);
    }
}

/* =========================
   FAGULHAS
========================= */

#fagulhas-container {
    position: fixed;
    inset: 0;

    pointer-events: none;
    overflow: hidden;

    z-index: -1;
}

.fagulha {
    position: absolute;
    bottom: -20px;

    border-radius: 50%;

    animation: subir linear infinite;
}

@keyframes subir {
    from {
        transform: translateY(0);
        opacity: 0;
    }

    20% {
        opacity: 1;
    }

    100% {
        transform: translateY(-110vh);
        opacity: 0;
    }
}

/* =========================
   RESPONSIVO
========================= */

@media (max-width: 600px) {

    .painel {
        grid-template-columns: 1fr;
    }

    .casa {
        width: 48px;
        height: 48px;
    }

    .container {
        padding-top: 20px;
    }
}
</style>
</head>

<body>

<!-- =========================
     CADASTRO
========================= -->

<div id="telaCadastro" class="tela-cadastro">

    <div class="card-cadastro">

        <h1>⚔️ Arena de Ares</h1>

        <p>
            Escolha um apelido para entrar na arena.
        </p>

        <input
            type="text"
            id="nomeJogador"
            placeholder="Seu apelido"
            maxlength="20"
            autocomplete="off"
        >

        <button onclick="entrarNoJogo()">
            ENTRAR NA ARENA
        </button>

        <p id="erroCadastro" class="erro"></p>

    </div>

</div>


<!-- =========================
     JOGO
========================= -->

<div class="container">

    <header>

        <h1>⚔️ ARENA DE ARES</h1>

        <p>
            Encontre as relíquias e evite as maldições!
        </p>

        <p id="jogador"></p>

    </header>


    <!-- PAINEL -->

    <div class="painel">

        <div class="info">

            <span>💰 Saldo</span>

            <strong>
                <span id="saldo">100.00</span>
            </strong>

        </div>

        <div class="info">

            <span>📈 Multiplicador</span>

            <strong id="multiplicador">
                1.0x
            </strong>

        </div>

        <div class="info">

            <span>🏆 Recompensa Atual</span>

            <strong id="lucroAtual">
                0.00
            </strong>

        </div>

    </div>


    <!-- CONTROLES -->

    <div class="controles">

        <div class="controle">

            <label for="valorAposta">
                Valor da aposta
            </label>

            <input
                type="number"
                id="valorAposta"
                min="1"
                max="100"
                value="10"
            >

        </div>


        <div class="controle">

            <label for="qtdMinas">
                Maldições
            </label>

            <input
                type="number"
                id="qtdMinas"
                min="1"
                value="5"
            >

        </div>


        <div class="controle">

            <label for="tamanhoGrade">
                Tabuleiro
            </label>

            <select id="tamanhoGrade"
                    onchange="alterarTamanhoTabuleiro()">

                <option value="5">5 × 5</option>
                <option value="6">6 × 6</option>
                <option value="7">7 × 7</option>

            </select>

        </div>


        <button
            id="btnAcao"
            class="btn-acao btn-apostar"
            onclick="gerenciarBotaoAcao()"
        >
            Iniciar Batalha
        </button>

    </div>


    <div id="mensagem"></div>


    <!-- TABULEIRO -->

    <div class="area-grade">

        <div id="grade"></div>

    </div>

</div>


<script>

/* =========================
   VARIÁVEIS
========================= */

let saldo = 100;

let valorAposta = 0;

let emJogo = false;

let bombas = [];

let acertos = 0;

let multiplicador = 1.0;

let dimensao = 5;


/* =========================
   ELEMENTOS
========================= */

const elementoSaldo =
    document.getElementById("saldo");

const elementoGrade =
    document.getElementById("grade");

const elementoMultiplicador =
    document.getElementById("multiplicador");

const elementoLucroAtual =
    document.getElementById("lucroAtual");

const btnAcao =
    document.getElementById("btnAcao");

const elementoMensagem =
    document.getElementById("mensagem");

const inputMinas =
    document.getElementById("qtdMinas");

const inputAposta =
    document.getElementById("valorAposta");

const telaCadastro =
    document.getElementById("telaCadastro");

const nomeJogador =
    document.getElementById("nomeJogador");

const erroCadastro =
    document.getElementById("erroCadastro");

const jogador =
    document.getElementById("jogador");


/* =========================
   SOM
========================= */

function tocarSom(caminho) {

    try {

        const audio = new Audio(caminho);

        audio.play().catch(() => {});

    } catch (e) {}

}


/* =========================
   CADASTRO
========================= */

function entrarNoJogo() {

    const nome =
        nomeJogador.value.trim();

    if (nome.length < 2) {

        erroCadastro.textContent =
            "Digite um apelido com pelo menos 2 caracteres.";

        return;
    }

    localStorage.setItem(
        "nomeJogador",
        nome
    );

    jogador.textContent =
        `⚔️ Guerreiro: ${nome}`;

    telaCadastro.classList.add(
        "escondido"
    );

    erroCadastro.textContent = "";

}


function verificarCadastro() {

    const nomeSalvo =
        localStorage.getItem(
            "nomeJogador"
        );

    if (nomeSalvo) {

        jogador.textContent =
            `⚔️ Guerreiro: ${nomeSalvo}`;

        telaCadastro.classList.add(
            "escondido"
        );

    }

}


/* =========================
   SALDO
========================= */

function carregarSaldo() {

    const saldoSalvo =
        localStorage.getItem(
            "saldoJogo"
        );

    if (saldoSalvo !== null) {

        saldo =
            Number(saldoSalvo);

    }

    atualizarSaldo();

}


function salvarSaldo() {

    localStorage.setItem(
        "saldoJogo",
        saldo.toFixed(2)
    );

}


function atualizarSaldo() {

    elementoSaldo.textContent =
        saldo.toFixed(2);

    inputAposta.max = saldo;

    if (
        parseFloat(inputAposta.value)
        > saldo
    ) {

        inputAposta.value =
            saldo > 0 ? saldo : 0;

    }

}


/* =========================
   TABULEIRO
========================= */

function alterarTamanhoTabuleiro() {

    if (emJogo) return;

    const valorSelecionado =
        parseInt(
            document.getElementById(
                "tamanhoGrade"
            ).value
        );

    dimensao =
        Math.min(
            Math.max(
                valorSelecionado,
                5
            ),
            7
        );

    const totalCasas =
        dimensao * dimensao;

    inputMinas.max =
        totalCasas - 1;

    if (
        parseInt(inputMinas.value)
        >= totalCasas
    ) {

        inputMinas.value =
            totalCasas - 1;

    }

    criarGrade();

}


function criarGrade() {

    elementoGrade.innerHTML = "";

    const totalCasas =
        dimensao * dimensao;

    elementoGrade.style.gridTemplateColumns =
        `repeat(${dimensao}, 56px)`;

    for (
        let i = 0;
        i < totalCasas;
        i++
    ) {

        const casa =
            document.createElement("button");

        casa.className = "casa";

        casa.dataset.index = i;

        casa.disabled = true;

        casa.onclick = () =>
            clicarCasa(i);

        elementoGrade.appendChild(
            casa
        );

    }

}


/* =========================
   BOTÃO PRINCIPAL
========================= */

function gerenciarBotaoAcao() {

    if (!emJogo) {

        iniciarJogo();

    } else {

        retirarLucro();

    }

}


/* =========================
   INICIAR
========================= */

function iniciarJogo() {

    const valorInput =
        parseFloat(
            inputAposta.value
        );

    const minasQtd =
        parseInt(
            inputMinas.value
        );

    const totalCasas =
        dimensao * dimensao;


    if (
        isNaN(valorInput)
        || valorInput <= 0
    ) {

        alert(
            "Digite um valor válido."
        );

        return;

    }


    if (valorInput > saldo) {

        alert(
            "Saldo insuficiente!"
        );

        inputAposta.value =
            saldo;

        return;

    }


    if (
        isNaN(minasQtd)
        || minasQtd < 1
        || minasQtd >= totalCasas
    ) {

        alert(
            `Escolha entre 1 e ${totalCasas - 1} maldições.`
        );

        return;

    }


    valorAposta =
        valorInput;

    saldo -=
        valorAposta;

    salvarSaldo();

    atualizarSaldo();


    bombas = [];

    while (
        bombas.length < minasQtd
    ) {

        const pos =
            Math.floor(
                Math.random()
                * totalCasas
            );

        if (
            !bombas.includes(pos)
        ) {

            bombas.push(pos);

        }

    }


    emJogo = true;

    acertos = 0;

    multiplicador = 1.0;

    elementoMensagem.textContent = "";


    inputAposta.disabled = true;

    inputMinas.disabled = true;

    document.getElementById(
        "tamanhoGrade"
    ).disabled = true;


    btnAcao.textContent =
        "🏆 Retirar Recompensa";

    btnAcao.className =
        "btn-acao btn-retirar";

    btnAcao.disabled = true;


    atualizarPainel();

    criarGrade();


    document
        .querySelectorAll(".casa")
        .forEach(casa => {

            casa.disabled = false;

        });

}


/* =========================
   EXPLOSÃO
========================= */

function criarEfeitoExplosao(elemento) {

    const cores = [
        "#ff2222",
        "#ff7700",
        "#ffcc00",
        "#ff0055",
        "#880000"
    ];

    for (
        let i = 0;
        i < 24;
        i++
    ) {

        const particula =
            document.createElement("div");

        particula.className =
            "particula-explosao";


        const angulo =
            Math.random()
            * Math.PI
            * 2;

        const distancia =
            30
            + Math.random() * 50;


        particula.style.setProperty(
            "--tx",
            Math.cos(angulo)
            * distancia
            + "px"
        );

        particula.style.setProperty(
            "--ty",
            Math.sin(angulo)
            * distancia
            + "px"
        );


        particula.style.backgroundColor =
            cores[
                Math.floor(
                    Math.random()
                    * cores.length
                )
            ];


        const tamanho =
            5
            + Math.random() * 6;

        particula.style.width =
            tamanho + "px";

        particula.style.height =
            tamanho + "px";


        elemento.style.position =
            "relative";

        elemento.appendChild(
            particula
        );


        setTimeout(() => {

            particula.remove();

        }, 600);

    }

}


/* =========================
   CLICAR CASA
========================= */

function clicarCasa(index) {

    if (!emJogo) return;


    const casas =
        document.querySelectorAll(
            ".casa"
        );

    const casa =
        casas[index];


    if (
        casa.innerHTML !== ""
    ) return;


    /* BOMBA */

    if (
        bombas.includes(index)
    ) {

        casa.innerHTML =
            "💀";

        casa.style.fontSize =
            "30px";

        casa.classList.add(
            "revelado-bomba"
        );

        criarEfeitoExplosao(
            casa
        );

        tocarSom(
            "sons/explosao.mp3"
        );

        finalizarJogo();

        return;

    }


    /* CASA SEGURA */

    casa.innerHTML =
        "👑";

    casa.style.fontSize =
        "30px";

    casa.classList.add(
        "revelado-reliquia"
    );

    casa.disabled = true;


    acertos++;

    multiplicador += 0.5;


    if (
        acertos === 1
    ) {

        btnAcao.disabled =
            false;

    }


    atualizarPainel();


    const totalCasas =
        dimensao * dimensao;

    const totalSeguras =
        totalCasas
        - bombas.length;


    if (
        acertos === totalSeguras
    ) {

        retirarLucro();

    }

}


/* =========================
   RETIRAR RECOMPENSA
========================= */

function retirarLucro() {

    if (
        !emJogo
        || acertos === 0
    ) return;


    emJogo = false;


    const valorGanho =
        valorAposta
        * multiplicador;


    saldo +=
        valorGanho;


    salvarSaldo();

    atualizarSaldo();


    elementoMensagem.style.color =
        "#ffd700";

    elementoMensagem.textContent =
        `🏛 Os Deuses abençoaram sua jornada! Recompensa: ${valorGanho.toFixed(2)}`;


    tocarSom(
        "sons/vitoria.mp3"
    );


    revelarBombas();


    btnAcao.disabled =
        true;


    setTimeout(() => {

        prepararNovoJogo();

    }, 2000);

}


/* =========================
   FINALIZAR
========================= */

function finalizarJogo() {

    emJogo = false;


    elementoMensagem.style.color =
        "#ff4d4d";

    elementoMensagem.textContent =
        `💥 A fúria de Ares venceu! Você perdeu ${valorAposta.toFixed(2)}.`;


    revelarBombas();


    tocarSom(
        "sons/explosao.mp3"
    );


    prepararNovoJogo();

}


/* =========================
   REVELAR BOMBAS
========================= */

function revelarBombas() {

    const casas =
        document.querySelectorAll(
            ".casa"
        );


    casas.forEach(
        (casa, idx) => {

            casa.disabled =
                true;


            if (
                bombas.includes(idx)
            ) {

                casa.innerHTML =
                    "💀";

                casa.style.fontSize =
                    "30px";

                casa.classList.add(
                    "revelado-bomba"
                );

            }

        }
    );

}


/* =========================
   NOVO JOGO
========================= */

function prepararNovoJogo() {

    inputAposta.disabled =
        false;

    inputMinas.disabled =
        false;

    document.getElementById(
        "tamanhoGrade"
    ).disabled =
        false;


    btnAcao.textContent =
        "⚔️ Iniciar Batalha";

    btnAcao.className =
        "btn-acao btn-apostar";

    btnAcao.disabled =
        false;


    multiplicador =
        1.0;

    elementoMultiplicador.textContent =
        "1.0x";

    elementoLucroAtual.textContent =
        "0.00";


    criarGrade();

}


/* =========================
   PAINEL
========================= */

function atualizarPainel() {

    elementoSaldo.textContent =
        saldo.toFixed(2);

    elementoMultiplicador.textContent =
        multiplicador.toFixed(1)
        + "x";

    elementoLucroAtual.textContent =
        (
            valorAposta
            * multiplicador
        ).toFixed(2);

}


/* =========================
   FAGULHAS
========================= */

function gerarFagulhasFundo() {

    let container =
        document.getElementById(
            "fagulhas-container"
        );


    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.id =
            "fagulhas-container";

        document.body.appendChild(
            container
        );

    }


    const cores = [
        "#ff3300",
        "#ff7700",
        "#ffaa00",
        "#ff0000"
    ];


    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const fagulha =
            document.createElement(
                "div"
            );

        fagulha.className =
            "fagulha";


        fagulha.style.left =
            Math.random()
            * 100
            + "vw";


        const duracao =
            3
            + Math.random() * 5;

        fagulha.style.animationDuration =
            duracao + "s";


        fagulha.style.animationDelay =
            Math.random() * 4
            + "s";


        const tamanho =
            3
            + Math.random() * 5;

        fagulha.style.width =
            tamanho + "px";

        fagulha.style.height =
            tamanho + "px";


        const cor =
            cores[
                Math.floor(
                    Math.random()
                    * cores.length
                )
            ];

        fagulha.style.backgroundColor =
            cor;

        fagulha.style.boxShadow =
            `0 0 8px ${cor}`;


        container.appendChild(
            fagulha
        );

    }

}


/* =========================
   INICIALIZAÇÃO
========================= */

verificarCadastro();

carregarSaldo();

alterarTamanhoTabuleiro();

gerarFagulhasFundo();

</script>

</body>
</html>
```
