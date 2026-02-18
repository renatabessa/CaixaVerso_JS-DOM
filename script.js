let btnFormulario = document.querySelector("#btn-formulario");
let btnCardRemover = document.querySelector(".btn-card");
const painelCards = document.querySelector(".card-painel");
let filtroTipo = document.querySelector("#filtro-tipo");

const clientesCadastrados = [];

let cliente = {
  nome: "",
  email: "",
  plano: "",
};

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

btnFormulario.addEventListener("click", () => {
  //Esta função vai captar os dados dos Input e enviar para um novo cliente
  let nomeInput = document.querySelector("#nome").value;
  let emailInput = document.querySelector("#email").value;
  let selectInput = document.querySelector("#plano").value;
  event.preventDefault();

  console.log(
    "Nome:" + nomeInput + " E-mail:" + emailInput + " Plano:" + selectInput,
  );
  //quando estiver funcionando corretamente, pode tirar este console

  try {
    if (!nomeInput || !emailInput || !selectInput) {
      throw new Error("Preencha todos os campos obrigatórios.");
      return
    } else if (clientesCadastrados.some(cliente => cliente.email === emailInput)) {
      throw new Error("Este email já está cadastrado.");
      return
    }else if (!emailInput.includes("@") || !emailInput.includes(".")) {
      throw new Error("Digite um email válido.");
      return
    }
    atualizarClientesCadastrados(nomeInput, emailInput, selectInput);
    armazenarCadastro();
    renderizarCadastros();
    renderizarResultadoMensagem("Usuário cadastrado com sucesso!");
  } catch (error) {
    renderizarResultadoMensagem(error.message, false);
  }
});

function armazenarCadastro() {
  localStorage.setItem(
    "clientes_db",
    JSON.stringify(clientesCadastrados), //colocar o array no local storage
  );
}

function atualizarClientesCadastrados(nome, email, plano) {
  console.log("usuario Cadastrado com sucesso");
  // a funcção atualizarClientesCadastrado() vai inserir o novo cliente no Array de clientes Cadastrados

  clientesCadastrados.push({ nome, email, plano });
  console.log(clientesCadastrados);
}

function renderizarCadastros() {
  console.log("Cadastro renderizado com sucesso");
  let painelCard = document.querySelector(".card-painel");

  painelCard.innerHTML = "";

  for (let i of clientesCadastrados) {
    const card = document.createElement("ul");
    card.classList.add("card-cadastro");
    card.innerHTML = `<li class="card-item">Cliente:</li>
                    <li class="Card-dados card-nome">${i.nome}</li>
                    <li class="card-dados">${i.email}</li>
                    <button class="btn-card" data-mail="${i.email}">Remover</button>
                    <li class="card-dados">${i.plano}</li>
                    `;

    console.log(card);

    painelCard.appendChild(card);
    // a função renderizarCliente() vai mostrar na tela os clientes que estão cadastrados no array
  }
}

function renderizarResultadoMensagem(mensagem, sucesso = true) {
  const mensagemElemento = document.querySelector("#mensagem-resultado");
  mensagemElemento.style.display = "block";
  mensagemElemento.textContent = mensagem;
  mensagemElemento.className = sucesso ? "mensagem-sucesso" : "mensagem-erro";
  setTimeout(ocultarMensagem, 3000);
}

function ocultarMensagem() {
  const mensagemElemento = document.querySelector("#mensagem-resultado");
  mensagemElemento.style.display = "none";}


painelCards.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("btn-card")) {
    const email = evento.target.getAttribute("data-mail");
    removerCadastro(email);
  }
});

function removerCadastro(email) {
  const index = clientesCadastrados.findIndex((cliente) => cliente.email === email);
  if (index !== -1) {
    clientesCadastrados.splice(index, 1);
  }
  armazenarCadastro();
  renderizarCadastros();
}

filtroTipo.addEventListener("change", filtrarPlanos);

function filtrarPlanos() {
  const tipoSelecionado = filtroTipo.value;
  console.log(tipoSelecionado);
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
