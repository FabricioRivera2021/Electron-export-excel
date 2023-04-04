
const contenedor = document.querySelector('#contenedor');
const tRow = document.querySelector('#tRow')
const table = document.querySelector('#tBody');

window.versions.readJson((data) => {
    // data.map((elem) => {
    //     console.log(JSON.stringify(elem));
    // })
    
    
    for (let i = 0; i < 10; i++) {        
        const row = table.insertRow(-1)
        
        const cell0 = row.insertCell(0);
        const cell1 = row.insertCell(1);
        const cell2 = row.insertCell(2);
        const cell3 = row.insertCell(3);
        const cell4 = row.insertCell(4);
        const cell5 = row.insertCell(5);
        const cell6 = row.insertCell(6);
        const cell7 = row.insertCell(7);
    
        cell0.innerHTML = data[i]['Numero de Documento'];
        cell1.innerHTML = data[i]['Nombre Destinatario']; //Nombre
        cell2.innerHTML = data[i]['Departamento']; //Depto
        cell3.innerHTML = data[i]['Localidad/Barrio']; //Localidad
        cell4.innerHTML = data[i]['Calle'] //calle
        cell5.innerHTML = data[i]['Celular']; //Celular
        cell6.innerHTML = data[i]['Notas']; //notas
        cell7.innerHTML = data[i]['Observaciones']; //observaciones
    
        if( i % 2 == 0){
            cell0.className = 'cellStyle';
            cell1.className = 'cellStyle';
            cell2.className = 'cellStyle';
            cell3.className = 'cellStyle';
            cell4.className = 'cellStyle';
            cell5.className = 'cellStyle';
            cell6.className = 'cellStyle';
            cell7.className = 'cellStyle';
        }else{
            cell0.className = 'cellStyle2';
            cell1.className = 'cellStyle2';
            cell2.className = 'cellStyle2';
            cell3.className = 'cellStyle2';
            cell4.className = 'cellStyle2';
            cell5.className = 'cellStyle2';
            cell6.className = 'cellStyle2';
            cell7.className = 'cellStyle2';
        }
    }
}) 