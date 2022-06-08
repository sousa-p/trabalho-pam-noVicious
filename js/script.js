//CACHE
function salvarDados() {
    let strObjSuperacoes;
    strObjSuperacoes = JSON.stringify(objSuperacoes);
    localStorage.setItem("superacoes", strObjSuperacoes);
}

function carregarDados(chave) {
    let dado;
    dado = localStorage.getItem(chave);
    if (!dado) {
        return [];
    }
    return JSON.parse(dado);
}


//CONSTANTES
const controlador = document.querySelector("#controlador");
const modalAddSuperacao = document.querySelector("#modalAddSuperacao");
const sairModal = document.querySelector("#fecharSuperacao");
const btnFinalizarSuperacao = document.querySelector("#modalAddSuperacao .add");
const inputsSuperacao = document.querySelectorAll(".formsAddSuperacao .input");
const ulSuperacoes = document.querySelector("#superacoes ul");

const objSuperacoes = carregarDados("superacoes");

const btnAddSuperacao = document.querySelector("#adicionar-superacao");

const modalAddNota = document.querySelector("#modalAddNota");
const sairAddNota = document.querySelector("#fecharAddNota");
const btnFinalizarNota = document.querySelector(".addNota");
const nota = document.querySelector("#modalAddNota textarea");

//MAIN
function gerarHtmlControlador() {
    if (objSuperacoes.length === 0) {
        //Caso não tenha objeto
        controlador.innerHTML = `
            <div class="header-controlador">
                <h1 class="semSuperacao_semNota">Você não tem nenhuma superação, que tal começar agora?</h1>
            </div>
        `;
    } else {
        //Se tiver
        let temNota;
        temNota = false;
        //Verificação se pelo meno um obj possui nota
        objSuperacoes.forEach((superacao) => {
            if (superacao.notas.length != 0) {
                temNota = true;
            }
        });

        if (temNota) {
            //Caso tenha
            let html;
            html = `
                <div class="header-controlador">
                    <h1 class="notasRecentes">Notas Recentes:</h1>
                </div>
                <div class="wrapper-notas">
            `;
            objSuperacoes.forEach((superacao) => {
                if (superacao.notas.length != 0) {
                    html += `
                    <div class="wrapper-nota">
                        <h2 class="dataNota">
                            ${superacao.notas[superacao.notas.length - 1].data}
                        </h2>
                        <p>
                            ${superacao.notas[superacao.notas.length - 1].texto}
                        </p>
                    </div>`;
                }
            });
            controlador.innerHTML = html;
        } else {
            //Caso não
            controlador.innerHTML = `
                <div class="header-controlador">
                    <h1 class="semSuperacao_semNota">Você não tem nenhuma nota, que tal adicionar uma?</h1>
            `;
        }
    }
}

// Superação
function finalizarSuperacao() {
    //Gerar o obj
    let objNovaSuperacao;
    objNovaSuperacao = {
        nome: `${inputsSuperacao[0].value}`,
        cor: `${inputsSuperacao[1].value}`,
        notas: [],
    };
    objSuperacoes.push(objNovaSuperacao);
    fecharModal(modalAddSuperacao);
    inputsSuperacao[0] = "";
    inputsSuperacao[1] = "#000000";
    salvarDados();
    atualizarSuperacoes();
    exibirSuperacao(objSuperacoes.length - 1);
}

function atualizarSuperacoes() {
    //Atualiza o html
    let html;
    html = "";
    objSuperacoes.forEach((superacao, id) => {
        html += `
            <li onclick="exibirSuperacao(${id})">
                <p style="color: ${superacao.cor}">${superacao.nome}</p>
                <div class="excluirSuperacao" onclick="excluirSuperacao(${id})">
                    x
                </div>
            </li>
        `;
    });
    ulSuperacoes.innerHTML = html;
}

function fecharModal(modal) {
    modal.classList.add("none");
}

function abrirModal(modal) {
    modal.classList.remove("none");
}

function exibirSuperacao(id) {
    // Gera html de todas superações
    if (objSuperacoes.length != 0) {
        let html;
        html = `
            <div class="header-controlador">
                <h1>
                    ${objSuperacoes[id].nome}
                </h1>
                <div id="addNota" onclick="abrirModalAddNota(${id})">
                    Adicionar Nota
                </div>
            </div>
            <div class="wrapper-notas">
        `;
        if (objSuperacoes[id].notas != []) {
            html += gerarHtmlNotas(id);
        }
        controlador.innerHTML = html;
    }
}

function excluirSuperacao(id) {
    objSuperacoes.splice(id, 1);
    salvarDados();
    atualizarSuperacoes();
    gerarHtmlControlador();
}

//NOTAS
function gerarHtmlNotas(id) {
    let htmlNotas;
    htmlNotas = "";
    objSuperacoes[id].notas.forEach((nota, idNota) => {
        htmlNotas += `
            <div class="wrapper-nota">
                <span class="excluirNota" onclick="excluirNota(${id},${idNota});">
                    x
                </span>
                <h2 class="dataNota">
                    ${nota.data}
                </h2>
                <p>
                    ${nota.texto}
                </p>
            </div>
        `;
    });
    return htmlNotas;
}

function abrirModalAddNota(id) {
    btnFinalizarNota.setAttribute("onclick", `adicionarNota(${id})`);
    abrirModal(modalAddNota);
}

function adicionarNota(id) {
    let data;
    data = new Date().toISOString().split("T")[0].split("-");
    objSuperacoes[id].notas.push({
        data: `${data[2]}/${data[1]}/${data[0]}`,
        texto: `${nota.value}`,
    });
    fecharModal(modalAddNota);
    nota.value = "";
    salvarDados();
    exibirSuperacao(id);
}

function excluirNota(idSuperacao, idNota) {
    objSuperacoes[idSuperacao].notas.splice(idNota, 1);
    salvarDados();
    exibirSuperacao(idSuperacao);
}
gerarHtmlControlador();
atualizarSuperacoes();
