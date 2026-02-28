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
  sobrenome: "",
  email: "",
  plano: "",
  cep: "",
  endereco: "",
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

window.onload = buscarElementosCadastrados();

function buscarElementosCadastrados() {
  const clientesReservados = localStorage.getItem("clientes_db");

  console.log(clientesReservados);

  if (clientesReservados) {
    const parsed = JSON.parse(clientesReservados);
    clientesCadastrados.push(...parsed);

    console.log(clientesCadastrados);
    renderizarCadastros();
  } else {
    return;
  }
}

// ----------------------
// Acionar o evento de clique no botão de cadastro para captar os dados dos inputs e criar um novo cliente
// ----------------------

btnFormulario.addEventListener("click", (e) => {
      // Esconder campos de endereço
      document.querySelectorAll('#rua, #bairro, #cidade, #estado, label[for="rua"], label[for="bairro"], label[for="cidade"], label[for="estado"]').forEach(function(el) {
        if (!el.classList.contains('secao-cep')) el.classList.add('secao-cep');
      });
      
  //Esta função vai captar os dados dos Input e enviar para um novo cliente
  let nomeInput = document.querySelector("#nome").value;
  let sobrenomeInput = document.querySelector("#sobrenome").value;
  let emailInput = document.querySelector("#email").value;
  let cepInput = document.querySelector("#cep").value;
  let ruaInput = document.querySelector("#rua").value;
  let bairroInput = document.querySelector("#bairro").value;
  let cidadeInput = document.querySelector("#cidade").value;
  let estadoInput = document.querySelector("#estado").value;
  let selectInput = document.querySelector("#plano").value;
  e.preventDefault();

  try {
    if (!nomeInput || !emailInput || !selectInput || !cepInput) {
      throw new Error("Preencha todos os campos obrigatórios.");
      return;
    } else if (
      clientesCadastrados.some((cliente) => cliente.email === emailInput)
    ) {
      throw new Error("Este email já está cadastrado.");
      return;
    } else if (!emailInput.includes("@") || !emailInput.includes(".")) {
      throw new Error("Digite um email válido.");
      return;
    }
    atualizarClientesCadastrados(
      nomeInput,
      sobrenomeInput,
      emailInput,
      cepInput,
      ruaInput,
      bairroInput,
      cidadeInput,
      estadoInput,
      selectInput,
    );
    console.log(clientesCadastrados);
    armazenarCadastro();
    renderizarCadastros();
    renderizarResultadoMensagem("Usuário cadastrado com sucesso!");
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
    renderizarResultadoMensagem(error.message, false);
  }
});

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
// Atualizar o array de clientes cadastrados com os novos clientes a cada cadastro
// ----------------------

function atualizarClientesCadastrados(nome, sobrenome, email, cep, rua, bairro, cidade, estado, plano) {
  console.log("usuario Cadastrado com sucesso");
  clientesCadastrados.push({ nome, sobrenome, email, cep, rua, bairro, cidade, estado, plano });
  console.log(clientesCadastrados);
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
    card.innerHTML = `<li class="card-item">Cliente:</li>
                    <li class="Card-dados card-nome">${i.nome} ${i.sobrenome}</li>
                    <li class="card-dados">${i.email}</li>
                    <button class="btn-card" data-mail="${i.email}">Remover</button>
                      <img class="avatar-card" src="https://ui-avatars.com/api/?name=${i.nome}+${i.sobrenome}&size=50&background=${i.plano === "gold" ? "e5ca2e" : i.plano === "silver" ? "C0C0C0" : "cd7f32"}&color=fff" alt="Avatar do cliente" />
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
// ----------------------
// Inclusão de mensagens de resultado (sucesso ou erro)
// ----------------------

function renderizarResultadoMensagem(mensagem, sucesso = true) {
  const mensagemElemento = document.querySelector("#mensagem-resultado");
  mensagemElemento.style.display = "block";
  mensagemElemento.textContent = mensagem;
  mensagemElemento.className = sucesso ? "mensagem-sucesso" : "mensagem-erro";
  setTimeout(ocultarMensagem, 3000);
}

// ----------------------
// Função para ocultar mensagem de resultado
// ----------------------
function ocultarMensagem() {
  const mensagemElemento = document.querySelector("#mensagem-resultado");
  mensagemElemento.style.display = "none";
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
// Validação visual do e-mail no blur
// ----------------------

document.querySelector("#email").addEventListener("blur", function () {
  const emailInput = this;
  if (!emailInput.value.includes("@") || !emailInput.value.includes(".")) {
    emailInput.style.borderColor = "red";
  } else {
    emailInput.style.borderColor = "";
  }
});

// ----------------------
// Pesquisa de cliente por nome ou e-mail
// ----------------------

campoBusca.addEventListener("input", () => {
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
                    <li class="Card-dados card-nome">${i.nome} ${i.sobrenome}</li>
                    <li class="card-dados">${i.email}</li>
                    <button class="btn-card" data-mail="${i.email}">Remover</button>
                    <img class="avatar-card" src="https://ui-avatars.com/api/?name=${i.nome}+${i.sobrenome}&size=50" alt="Avatar do cliente" />
                    <li class="card-dados">${i.plano}</li>
                    `;
    painelCard.appendChild(card);
    renderizarCardPlano(i.plano, card);
  }
});

// ----------------------
// implementação API CEP para preenchimento automático do endereço
// ----------------------

function mostrarCamposEndereco(mostrar) {
  document
    .querySelectorAll(
      '#rua, #bairro, #cidade, #estado, label[for="rua"], label[for="bairro"], label[for="cidade"], label[for="estado"]',
    )
    .forEach(function (el) {
      if (mostrar) {
        el.classList.remove("secao-cep");
      } else {
        if (!el.classList.contains("secao-cep")) el.classList.add("secao-cep");
      }
    });
}

document.querySelector("#cep").addEventListener("blur", function () {
  const cepInput = this;
  const cep = cepInput.value.replace(/\D/g, "");

  if (cep.length !== 8) {
    mostrarErro();
    mostrarCamposEndereco(false);
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then((response) => response.json())
    .then((data) => {
      if (data.erro) {
        mostrarErro();
        mostrarCamposEndereco(false);
        return;
      }
      document.querySelector("#rua").value = data.logradouro || "";
      document.querySelector("#bairro").value = data.bairro || "";
      document.querySelector("#cidade").value = data.localidade || "";
      document.querySelector("#estado").value = data.uf || "";

      cepInput.style.borderColor = "green";
      mostrarCamposEndereco(true);
    })
    .catch(() => {
      mostrarErro();
      mostrarCamposEndereco(false);
    });
});

function mostrarErro() {
  const cepInput = document.querySelector("#cep");
  cepInput.style.borderColor = "red";
  document.querySelector("#rua").value = "";
  document.querySelector("#bairro").value = "";
  document.querySelector("#cidade").value = "";
  document.querySelector("#estado").value = "";

  renderizarResultadoMensagem("CEP inválido ou não encontrado.", false);
}


//==========================================================================



// Funções de feedback visual (Sprint 3)
// ----------------------

// Mostra mensagem de status (etapas do processo assíncrono)
function mostrarStatus(mensagem) {
  const status = document.querySelector("#status");
  status.textContent = mensagem;
}

// Mostra área de loading com mensagem
function mostrarLoading(mensagem) {
  const loading = document.querySelector("#loading");
  loading.textContent = mensagem;
  loading.style.display = "block";
}

// Oculta área de loading
function ocultarLoading() {
  const loading = document.querySelector("#loading");
  loading.style.display = "none";
}

// ----------------------
// Mensagens de resultado (sucesso/erro)
// ----------------------
function renderizarResultadoMensagem(mensagem, sucesso = true) {
  const mensagemElemento = document.querySelector("#mensagem-resultado");
  mensagemElemento.style.display = "block";
  mensagemElemento.textContent = mensagem;
  mensagemElemento.className = sucesso ? "mensagem-sucesso" : "mensagem-erro";
  setTimeout(() => {
    mensagemElemento.style.display = "none";
  }, 5000);
}




// ----------------------
// Promise customizada: simulação de análise de crédito (Sprint 3)
// ----------------------
function simularAnaliseCredito(nome, plano) {
  return new Promise((resolve, reject) => {
    if (plano.toLowerCase() === "gold") {
      // Simula atraso de 5 segundos
      setTimeout(() => {
        // 20% de chance de reprovação
        if (Math.random() < 0.2) {
          reject("Cadastro negado: Análise de crédito reprovada.");
        } else {
          resolve("Análise de crédito aprovada.");
        }
      }, 5000);
    } else {
      // Silver e Bronze aprovam imediatamente
      resolve("Plano não exige análise de crédito.");
    }
  });
}



// ----------------------
// Fluxo de cadastro assíncrono (Sprint 3)
// ----------------------
btnFormulario.addEventListener("click", async (e) => {
  e.preventDefault();

  // Captura dos campos
  let nomeInput = document.querySelector("#nome").value;
  let sobrenomeInput = document.querySelector("#sobrenome").value;
  let emailInput = document.querySelector("#email").value;
  let cepInput = document.querySelector("#cep").value;
  let ruaInput = document.querySelector("#rua").value;
  let bairroInput = document.querySelector("#bairro").value;
  let cidadeInput = document.querySelector("#cidade").value;
  let estadoInput = document.querySelector("#estado").value;
  let selectInput = document.querySelector("#plano").value;

  // Bloqueia botão durante processamento
  btnFormulario.disabled = true;
  btnFormulario.textContent = "Processando...";

  try {
    // Validação local
    if (!nomeInput || !emailInput || !selectInput || !cepInput) {
      throw new Error("Preencha todos os campos obrigatórios.");
    } else if (
      clientesCadastrados.some((cliente) => cliente.email === emailInput)
    ) {
      throw new Error("Este email já está cadastrado.");
    } else if (!emailInput.includes("@") || !emailInput.includes(".")) {
      throw new Error("Digite um email válido.");
    }

    // Etapa 1: Consultando CEP
    mostrarStatus("1. Consultando CEP...");
    mostrarLoading("Consultando CEP...");

    // Consulta ViaCEP
    const response = await fetch(`https://viacep.com.br/ws/${cepInput}/json/`);
    const data = await response.json();
    ocultarLoading();

    if (data.erro) {
      throw new Error("CEP inválido ou não encontrado.");
    }

    // Preenche campos de endereço
    document.querySelector("#rua").value = data.logradouro || "";
    document.querySelector("#bairro").value = data.bairro || "";
    document.querySelector("#cidade").value = data.localidade || "";
    document.querySelector("#estado").value = data.uf || "";

    // Etapa 2: Análise de crédito
    mostrarStatus("2. Realizando análise de crédito...");
    await simularAnaliseCredito(nomeInput, selectInput);

    // Etapa 3: Gerando avatar
    mostrarStatus("3. Gerando Avatar...");
    const avatarUrl = `https://ui-avatars.com/api/?name=${nomeInput}+${sobrenomeInput}`;

    // Criação do objeto cliente
    const novoCliente = {
      id: Date.now(),
      nome: nomeInput,
      sobrenome: sobrenomeInput,
      email: emailInput,
      cep: cepInput,
      rua: ruaInput,
      bairro: bairroInput,
      cidade: cidadeInput,
      estado: estadoInput,
      plano: selectInput,
      avatar: avatarUrl,
      operador: sessionStorage.getItem("operador"),
    };

    // Etapa 4: Salvar cliente
    clientesCadastrados.push(novoCliente);
    localStorage.setItem("clientes_db", JSON.stringify(clientesCadastrados));
    renderizarCadastros();

    mostrarStatus("4. Cadastro concluído!");
    renderizarResultadoMensagem("Usuário cadastrado com sucesso!");

    // Limpar campos
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
    // Tratamento de falhas
    renderizarResultadoMensagem(error.message || error, false);
  } finally {
    // Reabilita botão
    btnFormulario.disabled = false;
    btnFormulario.textContent = "Salvar";
  }
});
// ----------------------
// Fim do código
// ----------------------