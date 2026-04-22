function solicitar() {
  let endereco = document.getElementById("endereco").value;

  if(endereco === "") {
    alert("Digite um endereço!");
    return;
  }

  document.getElementById("status").innerText =
    "Coleta solicitada com sucesso!";
}
