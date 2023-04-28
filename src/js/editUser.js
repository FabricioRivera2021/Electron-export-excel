
const id = document.querySelector('#id');
const ci = document.querySelector('#ci');
const nom = document.querySelector('#nombre');
const depto = document.querySelector('#depto');
const locBarr = document.querySelector('#locBarr');
const calle = document.querySelector('#calle');
const cel = document.querySelector('#cel');
const observ = document.querySelector('#obs');

window.versions.onEditUser((args, targetID) => {
    id.value = targetID
    ci.value = args["Numero de Documento"]
    nom.value = args["Nombre Destinatario"]
    depto.value = args["Departamento"]
    locBarr.value = args["Localidad/Barrio"]
    calle.value = args["Calle"]
    cel.value = args["Celular"]
    observ.value = args["Observaciones"]
})

//formulario
const formElem = document.querySelector('form');

//evento de guardado del formulario
formElem.addEventListener('submit', async(e) => {
    e.preventDefault();

    window.versions.submitForm(formElem);
})

/*
row">${data[i]["Numero de Documento"]}</td>
                    <td scope="row">${data[i]["Nombre Destinatario"]}</td>
                    <td scope="row">${data[i]["Departamento"]}</td>
                    <td scope="row">${data[i]["Localidad/Barrio"]}</td>
                    <td scope="row">${data[i]["Calle"]}</td>
                    <td scope="row">${data[i]["Celular"]}</td>
                    <td scope="row">${data[i]["Notas"]}</td>
                    <td scope="row">${data[i]["Observaciones"]}</td>


*/