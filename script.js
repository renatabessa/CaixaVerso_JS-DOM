let btnFormulario = document.querySelector("#btn-formulario");

const clientesCadastrados = [];

let cliente = {
  nome: "",
  email: "",
  plano: "",
};

window.onload = buscarElementosCadastrados();

function buscarElementosCadastrados(){
  const clientesReservados = localStorage.getItem("clientes_db")

  console.log(clientesReservados)

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

  console.log("Nome:" + nomeInput + " E-mail:" + emailInput + " Plano:" + selectInput);
  //quando estiver funcionando corretamente, pode tirar este console

  atualizarClientesCadastrados(nomeInput, emailInput, selectInput);
  armazenarCadastro();
  renderizarCadastros();
});

function armazenarCadastro(){
  localStorage.setItem(
    "clientes_db",
    JSON.stringify(clientesCadastrados),
  );
}
//colocar o array no local storage

function atualizarClientesCadastrados(nome, email, plano) {
  console.log("usuario Cadastrado com sucesso");
  // a funcção atualizarClientesCadastrado() vai inserir o novo cliente no Array de clientes Cadastrados

  clientesCadastrados.push({ nome, email, plano });
  console.log(clientesCadastrados);
}

function renderizarCadastros() {
  console.log("Cadastro renderizado com sucesso");
  let painelCard = document.querySelector(".card-painel");

  painelCard.innerHTML="";

    for (let i of clientesCadastrados) {
    const card = document.createElement("ul");
    card.classList.add("card-cadastro");
    card.innerHTML = `<li class="card-item">Cliente:</li>
                    <li class="Card-dados card-nome">${i.nome}</li>
                    <li class="card-dados">${i.email}</li>
                    <li class="card-dados">${i.plano}</li>
                    `;

    console.log(card);

    painelCard.appendChild(card);
  
    }
  // a função renderizarCliente() vai mostrar na tela os clientes que estão cadastrados no array
}

function removerCadastro(){
  //armazenarCadastro();
  //renderizarCadastros();
}
// a função removerCadastro() será chamada quando o ususario quiser remover o cliente

function filtrarCadastro(){
  //renderizarCadastros();
}
 //a função filtrarCadastro() será chamada quando o usuario escolher o filtro por tipo de plano