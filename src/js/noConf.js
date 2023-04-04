//formulario
const formElem = document.querySelector('form');

//evento de guardado del formulario
formElem.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData(formElem);

    const objForm = Object.fromEntries(form);

    console.log(objForm);

    window.versions.saveNoConf(JSON.stringify(objForm))
})

// formElem.addEventListener('formdata', (e) => {
//     console.log('form data fired');

//     const data = e.formData;

//     for (const value of data.values()){
//         console.log(value);
//         window.versions.saveNoConf(value);
//     }
// })