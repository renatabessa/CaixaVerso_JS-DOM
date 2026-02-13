let button = document.querySelector("#btn-formulario");

const clientesCadastrados = [];

let cliente = {
  nome: "",
  email: "",
  plano: "",
};

button.addEventListener("click", () => {
  //Esta função vai captar os dados dos Input e enviar para um novo cliente
  let nomeInput = document.querySelector("#nome").value;
  let emailInput = document.querySelector("#email").value;
  let selectInput = document.querySelector("#plano").value;
  event.preventDefault();

  console.log(nomeInput);
  console.log(emailInput);
  console.log(selectInput);
  //quando estiver funcionando corretamente, pode tirar estes consoles

  atualizarClientesCadastrados(nomeInput, emailInput, selectInput);
});

function atualizarClientesCadastrados(nome, email, plano) {
  console.log("usuario Cadastrado com sucesso");
  // a funcção atualizarClientesCadastrado() vai inserir o novo cliente no Array de clientes Cadastrados

  clientesCadastrados.push({ nome, email, plano });
  console.log(clientesCadastrados);
  //quando estiver funcionando corretamente a função, pode tirar estes consoles, estão aqui apenas para testes, A idéia é que a pareça "usuário cadastrado na tela" Pra isso tem que criar o elemento e inserir a informação.

  //renderizarCadastros();
}

function renderizarCadastros() {
  console.log("Cadastrao renderizado com sucesso");

  // a função renderizarCliente() vai mostrar na tela os clientes que estão cadastrados no arry
}
