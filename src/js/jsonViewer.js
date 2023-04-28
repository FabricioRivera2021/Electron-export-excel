const contenedor = document.querySelector("#contenedor");
const tRow = document.querySelector("#tRow");

window.versions.readJson(async (data) => {
  const elementsPerPage = 10;
  const totalPages = Math.ceil(data.length / elementsPerPage);
  let currentPage = 1;

  const renderTable = (start, end) => {
    //agregar para que no se pueda borrar el header
    const table = document.querySelector("#tBody");
    table.innerHTML = `
                 <tr id="tHeader">
                    <th scope="col" class="table-light">Documento</th>
                    <th scope="col" class="table-light">Nombre</th>
                    <th scope="col" class="table-light">Departamento</th>
                    <th scope="col" class="table-light">Localidad</th>
                    <th scope="col" class="table-light">Calle</th>
                    <th scope="col" class="table-light">Celular</th>
                    <th scope="col" class="table-light">Notas</th>
                    <th scope="col" class="table-light">Observaciones</th>
                    <th scope="col" class="table-light">Editar</th>
                 </tr>`;

    for (let i = start; i < end; i++) {
      let row = `<tr>
                    <td scope="row">${data[i]["Numero de Documento"]}</td>
                    <td scope="row">${data[i]["Nombre Destinatario"]}</td>
                    <td scope="row">${data[i]["Departamento"]}</td>
                    <td scope="row">${data[i]["Localidad/Barrio"]}</td>
                    <td scope="row">${data[i]["Calle"]}</td>
                    <td scope="row">${data[i]["Celular"]}</td>
                    <td scope="row">${data[i]["Notas"]}</td>
                    <td scope="row">${data[i]["Observaciones"]}</td>
                    <td scope="row"><button class="editBtn btn btn-primary" id="${i}">Editar</button></td>
                 </tr>`;
      table.innerHTML += row;
    }
    //await new Promise((resolve) => setTimeout(resolve, 1));
    const botonesEdicion = document.querySelectorAll('.editBtn');
    botonesEdicion.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        const target = e.currentTarget.id;
        const user = data[target];
        window.versions.editUser(target, user)
      })
    })
  };

  const renderPageButtons = () => {
    const pageButtonsContainer = document.querySelector("#pageButtonsContainer");
    pageButtonsContainer.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      button.addEventListener("click", () => {
        currentPage = i;
        const start = (currentPage - 1) * elementsPerPage;
        const end = currentPage * elementsPerPage;
        renderTable(start, end);
      });
      pageButtonsContainer.appendChild(button);
    }
  };

  renderPageButtons();
  renderTable(0, elementsPerPage);
});