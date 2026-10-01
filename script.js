class Tarefa {
    #concluida;

    constructor(descricao, concluida = false) {
        descricao = descricao.trim();

        if (descricao === "") {
            throw new Error("Digite uma tarefa.");
        }

        this.descricao = descricao;
        this.#concluida = concluida;
    }

    get concluida() {
        return this.#concluida;
    }

    alternarConclusao() {
        this.#concluida = !this.#concluida;
    }
}


// ==============================
// LISTA DE TAREFAS
// ==============================

const listaDeTarefas = [];


// ==============================
// ELEMENTOS DO HTML
// ==============================

const campoTarefas = document.getElementById("campo-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");
const contadorTarefas = document.getElementById("contador-tarefas");
const botaoAdicionar = document.querySelector(".botao-principal");
const botaoTema = document.getElementById("botao-alternar-tema");


// ==============================
// SALVAR TAREFAS
// ==============================

function salvarTarefas() {

    const tarefasParaSalvar = listaDeTarefas.map(function (tarefa) {

        return {
            descricao: tarefa.descricao,
            concluida: tarefa.concluida
        };

    });

    localStorage.setItem(
        "tarefas",
        JSON.stringify(tarefasParaSalvar)
    );
}


// ==============================
// CARREGAR TAREFAS
// ==============================

function carregarTarefas() {

    const tarefasSalvas = localStorage.getItem("tarefas");

    if (tarefasSalvas) {

        const tarefas = JSON.parse(tarefasSalvas);

        tarefas.forEach(function (tarefaSalva) {

            const tarefa = new Tarefa(
                tarefaSalva.descricao,
                tarefaSalva.concluida
            );

            listaDeTarefas.push(tarefa);

        });
    }

    renderizarTarefas();
}


// ==============================
// ADICIONAR TAREFA
// ==============================

botaoAdicionar.addEventListener("click", function () {

    try {

        const descricao = campoTarefas.value;

        const novaTarefa = new Tarefa(descricao);

        listaDeTarefas.push(novaTarefa);

        // Salva a tarefa
        salvarTarefas();

        // Mostra a tarefa na tela
        renderizarTarefas();

        campoTarefas.value = "";

        campoTarefas.focus();

    } catch (erro) {

        alert(erro.message);

    }

});


// ==============================
// ADICIONAR COM ENTER
// ==============================

campoTarefas.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        event.preventDefault();

        botaoAdicionar.click();

    }

});


// ==============================
// RENDERIZAR TAREFAS
// ==============================

function renderizarTarefas() {

    listaTarefas.innerHTML = "";

    listaDeTarefas.forEach(function (tarefa, index) {

        const item = document.createElement("li");

        item.classList.add("item-tarefa");


        // Texto da tarefa

        const texto = document.createElement("span");

        texto.textContent = tarefa.descricao;


        // Verifica se está concluída

        if (tarefa.concluida) {

            texto.style.textDecoration = "line-through";

            texto.style.opacity = "0.5";

        }


        // ==============================
        // BOTÃO CONCLUIR
        // ==============================

        const botaoConcluir = document.createElement("button");

        botaoConcluir.classList.add("botao-acao");


        if (tarefa.concluida) {

            botaoConcluir.innerHTML =
                `<i class="fa-solid fa-circle-check"></i>`;

        } else {

            botaoConcluir.innerHTML =
                `<i class="fa-regular fa-circle"></i>`;

        }


        botaoConcluir.addEventListener("click", function () {

            tarefa.alternarConclusao();

            // Salva a alteração
            salvarTarefas();

            renderizarTarefas();

        });


        // ==============================
        // BOTÃO EXCLUIR
        // ==============================

        const botaoExcluir = document.createElement("button");

        botaoExcluir.classList.add(
            "botao-acao",
            "excluir"
        );

        botaoExcluir.innerHTML =
            `<i class="fa-solid fa-trash"></i>`;


        botaoExcluir.addEventListener("click", function () {

            listaDeTarefas.splice(index, 1);

            // Salva a exclusão
            salvarTarefas();

            renderizarTarefas();

        });


        // ==============================
        // ÁREA DOS BOTÕES
        // ==============================

        const acoes = document.createElement("div");

        acoes.classList.add("acoes-tarefa");

        acoes.appendChild(botaoConcluir);

        acoes.appendChild(botaoExcluir);


        // ==============================
        // MONTAR TAREFA
        // ==============================

        item.appendChild(texto);

        item.appendChild(acoes);

        listaTarefas.appendChild(item);

    });


    atualizarContador();
}


// ==============================
// CONTADOR
// ==============================

function atualizarContador() {

    const quantidade = listaDeTarefas.length;


    if (quantidade === 0) {

        contadorTarefas.textContent =
            "0 tarefas na lista";

    } else if (quantidade === 1) {

        contadorTarefas.textContent =
            "1 tarefa na lista";

    } else {

        contadorTarefas.textContent =
            `${quantidade} tarefas na lista`;

    }

}


// ==============================
// ALTERNAR TEMA
// ==============================

botaoTema.addEventListener("click", function () {

    document.body.classList.toggle("modo-escuro");

    const icone = botaoTema.querySelector("i");


    if (document.body.classList.contains("modo-escuro")) {

        icone.classList.remove("fa-moon");

        icone.classList.add("fa-sun");

    } else {

        icone.classList.remove("fa-sun");

        icone.classList.add("fa-moon");

    }

});


// ==============================
// CARREGAR TAREFAS AO ABRIR
// ==============================

carregarTarefas();