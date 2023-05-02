const contenedor = document.querySelector("#contenedor");
const tRow = document.querySelector("#tRow");
const searchForm = document.querySelector("#searchForm");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchValue = e.currentTarget.buscador.value;

  window.versions.searchUser(searchValue).then((data) => {
    const elementsPerPage = 10;
    const totalPages = Math.ceil(data.length / elementsPerPage);
    let currentPage = 1;

    console.log('Esta es la data que llega', data[0])

    const renderTable = (start, end, lessThan10 = false, length) => {
      //agregar para que no se pueda borrar el header
      if(lessThan10 === true){
        end = length;
      }
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

      for (let i = 0; i < end; i++) {
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
      const botonesEdicion = document.querySelectorAll(".editBtn");
      botonesEdicion.forEach((elem) => {
        elem.addEventListener("click", (e) => {
          const target = e.currentTarget.id;
          const user = data[target];
          const userID = user.id;
          // console.log(userID);
          window.versions.editUser(userID, user);
        });
      });
    };

    const renderPageButtons = () => {
      const pageButtonsContainer = document.querySelector("#pageButtonsContainer");
      pageButtonsContainer.innerHTML = "";
      if(totalPages > 1){
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
      }
    };
  
    renderPageButtons();
    data.length < 10 ? renderTable(0, elementsPerPage, true, data.length) : renderTable(0, elementsPerPage); 

  });
});

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
    const botonesEdicion = document.querySelectorAll(".editBtn");
    botonesEdicion.forEach((elem) => {
      elem.addEventListener("click", (e) => {
        const target = e.currentTarget.id;
        const user = data[target];
        const userID = user.id;
        // console.log(userID);
        window.versions.editUser(userID, user);
      });
    });
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
