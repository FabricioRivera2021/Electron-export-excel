const button = document.querySelector("button");
const container = document.querySelector("#DB");
const msjDiv = document.querySelector("#aca");
const message = "";
const func = async () => {
  const response = await window.versions.ping();
  console.log(response);
  if (response != "OK") {
    msjDiv.innerHTML =
      "<p class='info-warning'>No hay una base de datos cargada, si es la primera vez que inicia la app. Se necesita cargar una base de datos para que la app pueda funcionar correctamente</p>";
    container.innerHTML = response;
    container.classList.add("msj-notok");
  }
  container.innerHTML = response;
  container.classList.add("msj-ok");
};
func();
