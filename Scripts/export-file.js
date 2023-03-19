const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");

const OKdatajson = JSON.parse(fs.readFileSync("./OKdatajson.json", "utf8"));

/* 1. leer los datos de un archivo excel a un archivo json ---
   2. comparar los datos del archivo json madre con el del 
   creado anteriormente
   3. crear un nuevo json con los usuarios que esten en ambos archivos
   json anteriores
   4. exportar ese archivo a excel
   5. festejar*/

// PASO 1
//cambiar el directorio
const directoryPath = path.join(__dirname + "../../", "TargetFile/");
// console.log(directoryPath);
var targetData = [];

fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    // console.log(file);
    const workBook = xlsx.readFile(`TargetFile/${file}`);
    // console.log(workBook)

    const sheet = workBook.Sheets["Sheet1"];
    // console.log(sheet);

    targetData = targetData.concat(
      xlsx.utils.sheet_to_json(sheet, { header: 2 })
    );
  });

  //PASO 2
  const matchingData = _.intersectionBy(OKdatajson, targetData, "cedula");
  //   console.log(matchingData);

  //PASO 3
  fs.writeFileSync(
    "./OKtargetDatajson.json",
    JSON.stringify(matchingData)
  );

  //PASO 4
  //leer archivo json y crear el excel
  const jsonData = JSON.parse(
    fs.readFileSync("./OKtargetDatajson.json", "utf8")
  );
  // console.log(jsonData);

  //crear un workbook
  const newWorkBook = xlsx.utils.book_new();
  // console.log(newWorkBook);

  //crear las sheets(hojas)
  const newSheet = xlsx.utils.json_to_sheet(jsonData);
  // console.log(newSheet);

  //agregar la sheet recien creada al libro creado antes(workBook)
  xlsx.utils.book_append_sheet(newWorkBook, newSheet, "usuarios");

  //escribir la data en el excel
  xlsx.writeFile(newWorkBook, `newExcel.xlsx`);
});
