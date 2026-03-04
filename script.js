let btnFormulario = document.querySelector("#btn-formulario");
let btnCardRemover = document.querySelector(".btn-card");
const painelCards = document.querySelector(".card-painel");
let filtroTipo = document.querySelector("#filtro-tipo");
const operadorNome = document.querySelector("#operador");
const campoBusca = document.querySelector("#busca");

const clientesCadastrados = [];

let cliente = {
  id: Date.now(),
  nome: "",
  email: "",
  plano: "",
  cep: "",
  rua: "",
  bairro: "",
  cidade: "",
  estado: "",
  avatar: "",
};

// ----------------------
// Inserir o nome do operador(a) atual e armazenar no session storage para manter a informação durante a sessão de uso do sistema
// ----------------------

function inicializarOperador() {
  let operadorName = sessionStorage.getItem("operador");

  if (!operadorName) {
    operadorName = prompt("Digite o nome do(a) operador(a):");
    if (operadorName && operadorName.trim() !== "") {
      sessionStorage.setItem("operador", operadorName.trim());
    } else {
      operadorName = "Não identificado";
    }
  }

  operadorNome.textContent = `${operadorName}`;
}

inicializarOperador();

// ----------------------
// BUscar os clientes cadastrados no local storage e renderizar os cards na tela a partir do Array de clientes cadastrados
// ----------------------

window.onload = buscarElementosCadastrados;

function buscarElementosCadastrados() {
  const clientesReservados = localStorage.getItem("clientes_db");

  if (clientesReservados) {
    const parsed = JSON.parse(clientesReservados);
    clientesCadastrados.push(...parsed);

    console.log(clientesCadastrados);
    renderizarCadastros();
  } else {
    return;
  }
}

// Função auxiliar para aguardar tempo (em milissegundos)

function aguardarTempo(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Validação visual E-mail e CEP blur

document.querySelector("#email").addEventListener("blur", function () {
  const emailInput = this;
  if (!emailInput.value.includes("@") || !emailInput.value.includes(".")) {
    emailInput.style.borderColor = "red";
  } else {
    emailInput.style.borderColor = "";
  }
});

document.querySelector("#cep").addEventListener("blur", function () {
  const cepInput = this;
  if (cepInput.value.length !== 8 || /\D/.test(cepInput.value)) {
    cepInput.style.borderColor = "red";
  } else {
    cepInput.style.borderColor = "";
  }
});

// ----------------------
// Acionar o evento de clique no botão de cadastro para captar os dados dos inputs e criar um novo cliente
// ----------------------

btnFormulario.addEventListener("click", async (e) => {
  e.preventDefault();

  let nomeInput = document.querySelector("#nome").value;
  let sobrenomeInput = document.querySelector("#sobrenome").value;
  let emailInput = document.querySelector("#email").value;
  let cepInput = document.querySelector("#cep").value;
  let selectInput = document.querySelector("#plano").value;

  btnFormulario.disabled = true;
  btnFormulario.textContent = "Processando...";

  mostrarLoading("Validando dados...");
  await aguardarTempo(2000);
  ocultarLoading();

  try {
    if (!nomeInput || !emailInput || !selectInput || !cepInput) {
      throw new Error("Preencha todos os campos obrigatórios.");
    } else if (
      clientesCadastrados.some((cliente) => cliente.email === emailInput)
    ) {
      throw new Error("Este email já está cadastrado.");
    } else if (!emailInput.includes("@") || !emailInput.includes(".")) {
      throw new Error("Digite um email válido.");
    }

    // chama o CEP e aguarda o retorno dos dados (ou uma rejeição em caso de
    // CEP inválido)

    const dataCEP = await consultarCEP(cepInput);
    ocultarLoading();

    if (dataCEP.erro) {
      throw new Error("CEP inválido ou não encontrado.");
    }

    let ruaInput = document.querySelector("#rua").value;
    let bairroInput = document.querySelector("#bairro").value;
    let cidadeInput = document.querySelector("#cidade").value;
    let estadoInput = document.querySelector("#estado").value;

    await simularAnaliseCredito(selectInput);
    ocultarLoading();
    mostrarLoading("Gerando Avatar...");

    const novoCLiente = {
      id: Date.now(),
      nome: `${nomeInput} ${sobrenomeInput}`,
      email: emailInput,
      cep: cepInput,
      rua: ruaInput,
      bairro: bairroInput,
      cidade: cidadeInput,
      estado: estadoInput,
      plano: selectInput,
      avatar: gerandoAvatar(nomeInput, sobrenomeInput, selectInput),
    };
    await aguardarTempo(4000).then(() => {
      ocultarLoading();
    });

    atualizarClientesCadastrados(novoCLiente);
    armazenarCadastro();
    renderizarCadastros();
    renderizarResultadoMensagem("Cliente cadastrado com sucesso!");

    // Limpar campos do formulário
    document.querySelector("#nome").value = "";
    document.querySelector("#sobrenome").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#cep").value = "";
    document.querySelector("#rua").value = "";
    document.querySelector("#bairro").value = "";
    document.querySelector("#cidade").value = "";
    document.querySelector("#estado").value = "";
    document.querySelector("#plano").value = "";
  } catch (error) {
    renderizarResultadoMensagem(error.message || error, false);
  } finally {
    btnFormulario.disabled = false;
    btnFormulario.textContent = "Cadastrar";
    mostrarCamposEndereco(false);
  }
});

// ----------------------
// Atualizar o array de clientes cadastrados com os novos clientes a cada cadastro
// ----------------------

function atualizarClientesCadastrados(novoCliente) {
  clientesCadastrados.push(novoCliente);
  console.log(clientesCadastrados);
}

// ----------------------
// Armazenar o cadastro no local storage a cada novo cliente cadastrado
// ----------------------

function armazenarCadastro() {
  localStorage.setItem(
    "clientes_db",
    JSON.stringify(clientesCadastrados), //colocar o array no local storage
  );
}

// ----------------------
// Inserir os cards na tela a partir do Array de clientes cadastrados
// ----------------------

function renderizarCadastros() {
  let painelCard = document.querySelector(".card-painel");

  painelCard.innerHTML = "";

  for (let i of clientesCadastrados) {
    const card = document.createElement("ul");
    card.classList.add("card-cadastro");

    const avatarUrl =
      i.avatar ||
      `https://ui-avatars.com/api/?name=${i.nome.replace(/ /g, "+")}&size=50&background=${
        i.plano === "gold"
          ? "e5ca2e"
          : i.plano === "silver"
            ? "C0C0C0"
            : "cd7f32"
      }&color=fff`;

    card.innerHTML = `<li class="card-item">Cliente:</li>
                    <li class="Card-dados card-nome">${i.nome}</li>
                    <li class="card-dados">${i.email}</li>
                    <button class="btn-card" data-mail="${i.email}">Remover</button>
                      <img class="avatar-card" src="${avatarUrl}" alt="Avatar do cliente" />
                    <li class="card-dados">${i.plano}</li>
                    `;
    renderizarCardPlano(i.plano, card);

    painelCard.appendChild(card);
  }
}

function renderizarCardPlano(plano, card) {
  switch (plano.toLowerCase()) {
    case "gold":
      card.style.borderColor = "gold";
      card.classList.add("gold");
      break;
    case "silver":
      card.style.borderColor = "silver";
      card.classList.add("silver");
      break;
    case "bronze":
      card.style.borderColor = "#cd7f32";
      card.classList.add("bronze");
      break;
    default:
      card.style.borderColor = "gray";
      card.classList.add("default");
  }
}

function gerandoAvatar(nome = "", sobrenome = "", plano = "") {
  const url = `https://ui-avatars.com/api/?name=${nome.replace(/ /g, "+")}+${sobrenome}&size=50&background=${plano === "gold" ? "e5ca2e" : plano === "silver" ? "C0C0C0" : "cd7f32"}&color=fff`;

  const avatarElem = document.querySelector("#avatar");
  if (avatarElem) {
    avatarElem.src = url;
  }

  return url;
}

// ----------------------
// Mensagens de resultado (sucesso ou erro)
// ----------------------

function renderizarResultadoMensagem(mensagem, sucesso = true) {
  const mensagemElemento = document.querySelector("#mensagem-resultado");
  mensagemElemento.style.display = "block";
  mensagemElemento.textContent = mensagem;
  mensagemElemento.className = sucesso ? "mensagem-sucesso" : "mensagem-erro";
  aguardarTempo(5000).then(() => {
    mensagemElemento.style.display = "none";
  });
}

// ----------------------
// Remover cadastro
// ----------------------

painelCards.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("btn-card")) {
    const email = evento.target.getAttribute("data-mail");
    removerCadastro(email);
  }
});

function removerCadastro(email) {
  const index = clientesCadastrados.findIndex(
    (cliente) => cliente.email === email,
  );
  if (index !== -1) {
    clientesCadastrados.splice(index, 1);
  }
  armazenarCadastro();
  renderizarCadastros();
}

// ----------------------
// Pesquisa de cliente por nome ou e-mail
// ----------------------

campoBusca.addEventListener("input", pesquisarCliente);

function pesquisarCliente() {
  const termo = campoBusca.value.toLowerCase();

  const painelCard = document.querySelector(".card-painel");
  painelCard.innerHTML = "";

  // Filtra clientes pelo nome ou email
  const filtrados = clientesCadastrados.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.email.toLowerCase().includes(termo),
  );

  // Renderiza apenas os filtrados
  for (let i of filtrados) {
    const card = document.createElement("ul");
    card.classList.add("card-cadastro");
    card.innerHTML = `<li class="card-item">Cliente:</li>
                    <li class="Card-dados card-nome">${i.nome}</li>
                    <li class="card-dados">${i.email}</li>
                    <button class="btn-card" data-mail="${i.email}">Remover</button>
                    <img class="avatar-card" src="${i.avatar || `https://ui-avatars.com/api/?name=${i.nome.replace(/ /g, "+")}&size=50`}" alt="Avatar do cliente" />
                    <li class="card-dados">${i.plano}</li>
                    `;
    painelCard.appendChild(card);
    renderizarCardPlano(i.plano, card);
  }
}

// Consulta o CEP via API ViaCEP e preenche os campos automaticamente, além de validar o CEP e mostrar mensagens de erro ou sucesso

function consultarCEP(cep) {
  const cepInput = document.querySelector("#cep");

  cep = cep.replace(/\D/g, "");

  if (cep.length !== 8) {
    //  mostrarErro();CONFIRMAR PARA DELETAR DE VEZ
    mostrarCamposEndereco(false);
    return Promise.reject(new Error("CEP deve conter 8 dígitos."));
  }

  mostrarLoading("Consultando CEP...");

  return fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then((response) => response.json())
    .then((data) => {
      if (data.err) {
        mostrarCamposEndereco(false);
      }

      // Aguarda 5 segundos para validação do CEP
      return aguardarTempo(5000).then(() => {
        ocultarLoading();

        document.querySelector("#rua").value = data.logradouro || "";
        document.querySelector("#bairro").value = data.bairro || "";
        document.querySelector("#cidade").value = data.localidade || "";
        document.querySelector("#estado").value = data.uf || "";

        mostrarCamposEndereco(true);

        return data;
      });
    })
    .catch((err) => {
      ocultarLoading();
      throw new Error("Erro ao consultar CEP");
    });
}

// ----------------------
// Filtro do tipo de plano
// ----------------------

filtroTipo.addEventListener("change", filtrarPlanos);

function filtrarPlanos() {
  const tipoSelecionado = filtroTipo.value;

  const cards = document.querySelectorAll(".card-cadastro");

  cards.forEach((card) => {
    const plano = card.querySelector(".card-dados:last-child").textContent;
    if (
      tipoSelecionado === "todos" ||
      plano.toLowerCase() === tipoSelecionado
    ) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// ----------------------
// Implementacao API CEP para preenchimento automatico do endereco
// ----------------------

function mostrarCamposEndereco(mostrar) {
  const seletores =
    '#rua, #bairro, #cidade, #estado, label[for="rua"], label[for="bairro"], label[for="cidade"], label[for="estado"]';
  const elementos = document.querySelectorAll(seletores);

  elementos.forEach(function (el) {
    if (mostrar) {
      // Mostrar: remove a classe que oculta
      el.classList.remove("secao-cep");
    } else {
      // Ocultar: adiciona a classe que oculta
      el.classList.add("secao-cep");
    }
  });
}

//==================
// Simulação de análise de crédito para clientes do plano Gold
//==================

function simularAnaliseCredito(plano) {
  return new Promise((resolve, reject) => {
    mostrarLoading("Realizando análise de crédito...");
    const numeroAleatorio = Math.random();
    console.log("Número aleatório para análise de crédito:", numeroAleatorio);
    if (plano.toLowerCase() === "gold") {
      aguardarTempo(5000).then(() => {
        if (numeroAleatorio < 0.2) {
          reject("Cadastro negado: Análise de crédito reprovada.");
          ocultarLoading();
        } else {
          resolve("Análise de crédito aprovada.");
          ocultarLoading();
        }
      });
    } else {
      resolve("Plano não exige análise de crédito.");
    }
  });
}

// Mostra área de loading com mensagem

function mostrarLoading(mensagem) {
  const loading = document.querySelector("#status");
  const loadingIcon = document.querySelector("#status-icon");
  console.log("Mostrando loading:", mensagem);
  if (loadingIcon) {
    loadingIcon.style.display = "inline-block";
  }
  loading.textContent = mensagem;
  loading.style.display = "block";
}

//Ocultar área de loading

function ocultarLoading() {
  const loading = document.querySelector("#status");
  const loadingIcon = document.querySelector("#status-icon");
  if (loadingIcon) {
    loadingIcon.style.display = "none";
  }
  loading.style.display = "none";
}
