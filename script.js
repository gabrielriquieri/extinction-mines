/* =================================
   ARENA DE ARES
================================= */


/* =================================
   VARIÁVEIS
================================= */

let pontos = 100;

let emJogo = false;

let bombas = [];

let casasClicadas = [];

let acertos = 0;

let multiplicador = 1.0;

let dimensao = 6;

let quantidadeMinas = 5;


/* =================================
   ELEMENTOS
================================= */

const telaCadastro =
    document.getElementById("telaCadastro");

const formCadastro =
    document.getElementById("formCadastro");

const nomeUsuario =
    document.getElementById("nomeUsuario");

const nomeCompleto =
    document.getElementById("nomeCompleto");

const email =
    document.getElementById("email");

const telefone =
    document.getElementById("telefone");

const cpf =
    document.getElementById("cpf");

const senha =
    document.getElementById("senha");

const confirmarSenha =
    document.getElementById("confirmarSenha");

const erroCadastro =
    document.getElementById("erroCadastro");

const jogador =
    document.getElementById("jogador");

const saldo =
    document.getElementById("saldo");

const grade =
    document.getElementById("grade");

const multiplicadorHTML =
    document.getElementById("multiplicador");

const lucroAtual =
    document.getElementById("lucroAtual");

const btnAcao =
    document.getElementById("btnAcao");

const mensagem =
    document.getElementById("mensagem");

const qtdMinas =
    document.getElementById("qtdMinas");

const tamanhoTabuleiro =
    document.getElementById("tamanhoTabuleiro");

const btnTrocarJogador =
    document.getElementById("btnTrocarJogador");

const fagulhasContainer =
    document.getElementById("fagulhas-container");


/* =================================
   MÁSCARA DO TELEFONE
================================= */

telefone.addEventListener(
    "input",
    function () {

        let valor =
            telefone.value.replace(/\D/g, "");

        valor =
            valor.substring(0, 11);

        if (valor.length <= 10) {

            valor =
                valor.replace(
                    /^(\d{2})(\d)/,
                    "($1) $2"
                );

            valor =
                valor.replace(
                    /(\d{4})(\d)/,
                    "$1-$2"
                );

        } else {

            valor =
                valor.replace(
                    /^(\d{2})(\d)/,
                    "($1) $2"
                );

            valor =
                valor.replace(
                    /(\d{5})(\d)/,
                    "$1-$2"
                );
        }

        telefone.value = valor;

    }
);


/* =================================
   MÁSCARA DO CPF
================================= */

cpf.addEventListener(
    "input",
    function () {

        let valor =
            cpf.value.replace(/\D/g, "");

        valor =
            valor.substring(0, 11);

        valor =
            valor.replace(
                /(\d{3})(\d)/,
                "$1.$2"
            );

        valor =
            valor.replace(
                /(\d{3})(\d)/,
                "$1.$2"
            );

        valor =
            valor.replace(
                /(\d{3})(\d{1,2})$/,
                "$1-$2"
            );

        cpf.value = valor;

    }
);


/* =================================
   CADASTRO
================================= */

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

    } else {

        telaCadastro.classList.remove(
            "escondido"
        );
    }
}


/* =================================
   ENVIAR CADASTRO
================================= */

formCadastro.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const usuario =
            nomeUsuario.value.trim();

        const nome =
            nomeCompleto.value.trim();

        const emailValor =
            email.value.trim();

        const telefoneValor =
            telefone.value.trim();

        const cpfValor =
            cpf.value.trim();

        const senhaValor =
            senha.value;

        const confirmarValor =
            confirmarSenha.value;


        /* NOME DE USUÁRIO */

        if (usuario.length < 3) {

            erroCadastro.textContent =
                "O nome de usuário precisa ter pelo menos 3 caracteres.";

            return;
        }


        /* NOME */

        if (nome.length < 2) {

            erroCadastro.textContent =
                "Digite seu nome.";

            return;
        }


        /* E-MAIL */

        if (
            !emailValor.includes("@")
        ) {

            erroCadastro.textContent =
                "Digite um e-mail válido.";

            return;
        }


        /* TELEFONE */

        const telefoneNumeros =
            telefoneValor.replace(
                /\D/g,
                ""
            );

        if (
            telefoneNumeros.length < 10
        ) {

            erroCadastro.textContent =
                "Digite um número de telefone válido.";

            return;
        }


        /* CPF */

        const cpfNumeros =
            cpfValor.replace(
                /\D/g,
                ""
            );

        if (
            cpfNumeros.length !== 11
        ) {

            erroCadastro.textContent =
                "Digite um CPF de demonstração com 11 números.";

            return;
        }


        /* SENHA */

        if (
            senhaValor.length < 6
        ) {

            erroCadastro.textContent =
                "A senha precisa ter pelo menos 6 caracteres.";

            return;
        }


        /* CONFIRMAR SENHA */

        if (
            senhaValor !== confirmarValor
        ) {

            erroCadastro.textContent =
                "As senhas não são iguais.";

            return;
        }


        /*
         * IMPORTANTE:
         * Não salvamos CPF, telefone,
         * e-mail ou senha.
         */

        localStorage.setItem(
            "nomeJogador",
            usuario
        );


        jogador.textContent =
            `⚔️ Guerreiro: ${usuario}`;


        erroCadastro.textContent = "";


        telaCadastro.classList.add(
            "escondido"
        );

    }
);


/* =================================
   TROCAR JOGADOR
================================= */

btnTrocarJogador.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "nomeJogador"
        );

        formCadastro.reset();

        erroCadastro.textContent = "";

        telaCadastro.classList.remove(
            "escondido"
        );

    }
);


/* =================================
   ATUALIZAR PAINEL
================================= */

function atualizarPainel() {

    saldo.textContent =
        Math.floor(pontos);

    multiplicadorHTML.textContent =
        `x${multiplicador.toFixed(1)}`;


    const pontosRodada =
        Math.floor(
            acertos *
            multiplicador *
            5
        );


    lucroAtual.textContent =
        pontosRodada;
}


/* =================================
   CRIAR TABULEIRO
================================= */

function criarGrade() {

    grade.innerHTML = "";

    grade.style.gridTemplateColumns =
        `repeat(${dimensao}, 1fr)`;


    const totalCasas =
        dimensao * dimensao;


    for (
        let i = 0;
        i < totalCasas;
        i++
    ) {

        const casa =
            document.createElement(
                "button"
            );


        casa.classList.add(
            "casa"
        );


        casa.dataset.index = i;

        casa.textContent = "?";

        casa.disabled = true;


        casa.addEventListener(
            "click",
            function () {

                clicarCasa(
                    i,
                    casa
                );

            }
        );


        grade.appendChild(casa);
    }
}


/* =================================
   GERAR MINAS
================================= */

function gerarBombas() {

    bombas = [];


    const totalCasas =
        dimensao * dimensao;


    while (
        bombas.length <
        quantidadeMinas
    ) {

        const numero =
            Math.floor(
                Math.random() *
                totalCasas
            );


        if (
            !bombas.includes(numero)
        ) {

            bombas.push(numero);
        }
    }
}


/* =================================
   COMEÇAR JOGO
================================= */

function iniciarJogo() {

    if (pontos <= 0) {

        mensagem.textContent =
            "Você ficou sem pontos.";

        return;
    }


    quantidadeMinas =
        parseInt(
            qtdMinas.value
        );


    dimensao =
        parseInt(
            tamanhoTabuleiro.value
        );


    const totalCasas =
        dimensao * dimensao;


    if (
        quantidadeMinas >=
        totalCasas
    ) {

        mensagem.textContent =
            "A quantidade de minas é muito alta.";

        return;
    }


    gerarBombas();


    casasClicadas = [];

    acertos = 0;

    multiplicador = 1.0;

    emJogo = true;


    pontos--;


    btnAcao.textContent =
        "🏆 FINALIZAR RODADA";


    btnAcao.classList.remove(
        "btn-apostar"
    );


    btnAcao.classList.add(
        "btn-retirar"
    );


    qtdMinas.disabled = true;

    tamanhoTabuleiro.disabled = true;


    mensagem.textContent =
        "Escolha uma casa da arena!";


    atualizarPainel();

    criarGrade();


    const casas =
        document.querySelectorAll(
            ".casa"
        );


    casas.forEach(
        function (casa) {

            casa.disabled = false;

        }
    );
}


/* =================================
   CLICAR CASA
================================= */

function clicarCasa(
    index,
    elemento
) {

    if (!emJogo) {
        return;
    }


    if (
        casasClicadas.includes(index)
    ) {

        return;
    }


    casasClicadas.push(index);


    /* MINA */

    if (
        bombas.includes(index)
    ) {

        elemento.textContent =
            "💀";


        elemento.classList.add(
            "revelado-bomba"
        );


        mensagem.textContent =
            "💥 Você encontrou uma mina!";


        revelarBombas();


        finalizarJogo(false);


        return;
    }


    /* RELÍQUIA */

    elemento.textContent =
        "👑";


    elemento.classList.add(
        "revelado-reliquia"
    );


    elemento.disabled = true;


    acertos++;

    multiplicador += 0.5;


    mensagem.textContent =
        "👑 Relíquia encontrada! Continue.";


    atualizarPainel();


    const totalCasas =
        dimensao * dimensao;


    const casasSeguras =
        totalCasas -
        quantidadeMinas;


    if (
        acertos >= casasSeguras
    ) {

        finalizarJogo(true);
    }
}


/* =================================
   REVELAR MINAS
================================= */

function revelarBombas() {

    const casas =
        document.querySelectorAll(
            ".casa"
        );


    bombas.forEach(
        function (index) {

            const casa =
                casas[index];


            if (!casa) {
                return;
            }


            casa.textContent =
                "💣";


            casa.classList.add(
                "revelado-bomba"
            );

        }
    );
}


/* =================================
   FINALIZAR JOGO
================================= */

function finalizarJogo(vitoria) {

    emJogo = false;


    const ganho =
        Math.floor(
            acertos *
            multiplicador *
            5
        );


    if (vitoria) {

        pontos += ganho;


        mensagem.textContent =
            `🏆 Vitória! Você ganhou ${ganho} pontos.`;

    } else {

        mensagem.textContent =
            "💀 Você perdeu a rodada.";

    }


    atualizarPainel();


    qtdMinas.disabled = false;

    tamanhoTabuleiro.disabled = false;


    btnAcao.textContent =
        "⚔️ COMEÇAR RODADA";


    btnAcao.classList.remove(
        "btn-retirar"
    );


    btnAcao.classList.add(
        "btn-apostar"
    );


    setTimeout(
        function () {

            acertos = 0;

            multiplicador = 1.0;

            lucroAtual.textContent =
                "0";

            criarGrade();

            atualizarPainel();

        },
        2000
    );
}


/* =================================
   BOTÃO PRINCIPAL
================================= */

btnAcao.addEventListener(
    "click",
    function () {

        if (!emJogo) {

            iniciarJogo();

        } else {

            finalizarJogo(true);

        }

    }
);


/* =================================
   MUDAR TABULEIRO
================================= */

tamanhoTabuleiro.addEventListener(
    "change",
    function () {

        if (emJogo) {
            return;
        }


        dimensao =
            parseInt(
                tamanhoTabuleiro.value
            );


        criarGrade();

    }
);


/* =================================
   FAGULHAS
================================= */

function gerarFagulhasFundo() {

    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const fagulha =
            document.createElement(
                "div"
            );


        fagulha.classList.add(
            "fagulha"
        );


        fagulha.style.left =
            `${Math.random() * 100}%`;


        fagulha.style.animationDelay =
            `${Math.random() * 6}s`;


        fagulha.style.animationDuration =
            `${3 + Math.random() * 5}s`;


        fagulhasContainer.appendChild(
            fagulha
        );

    }
}


/* =================================
   INICIAR
================================= */

verificarCadastro();

criarGrade();

atualizarPainel();

gerarFagulhasFundo();
