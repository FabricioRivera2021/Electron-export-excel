const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

//1. Leer datos de archivo excel y guardarlo en formato json
const db = xlsx.readFile('./Database/dataTest.xls', {cellDates:true})

//Leer archivo excel
const sheet = db.Sheets['Sheet1'];
// console.log(sheet);

//convertir a json
const data = xlsx.utils.sheet_to_json(sheet, {header: 2});
// console.log(data);

//convertir el telefono a string, queda como tarea
let newData = []; 
newData = data.map(item => {
    // item = item.calle.trim();
    item.cel = '0' + item.cel.toString();
    return item;
})

// console.log(newData);

//guardar la data en el archivo json
// fs.writeFileSync('./datajson.json', JSON.stringify(newData));

//---------------------------------------------------------------------------

//leer archivo json y crear el excel
const jsonData = JSON.parse(fs.readFileSync('./datajson.json', 'utf8'));
// console.log(jsonData);

//crear un workbook
const newWorkBook = xlsx.utils.book_new()
// console.log(newWorkBook);

//crear las sheets(hojas)
const newSheet = xlsx.utils.json_to_sheet(jsonData);
// console.log(newSheet);

//agregar la sheet recien creada al libro creado antes(workBook)
xlsx.utils.book_append_sheet(newWorkBook, newSheet, 'usuarios')

//escribir la data en el excel
xlsx.writeFile(newWorkBook, 'newExcel.xlsx');


