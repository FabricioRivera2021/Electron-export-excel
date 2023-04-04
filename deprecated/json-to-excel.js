const xlsx = require("xlsx");
const fs = require("fs");

export function exportJson(){
    //leer archivo json y crear el excel
    const jsonData = JSON.parse(fs.readFileSync('./OKtargetDatajson.json', 'utf8'));
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
    xlsx.writeFile(newWorkBook, `newExcel-${new Date}.xlsx`);
}