const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

//cambiar el directorio
const directoryPath = path.join(__dirname + "../../", "Database/");
// console.log(directoryPath);
var rawData = [];

fs.readdir(directoryPath, function (err, files){
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    // console.log(file);
    const workBook = xlsx.readFile(`./Database/${file}`);
    // console.log(workBook)

    const sheet = workBook.Sheets["Sheet1"];
    // console.log(sheet);

    rawData = rawData.concat(xlsx.utils.sheet_to_json(sheet, { header: 2 }));
    // console.log(data);
  });

  fs.writeFileSync('./RAWdatajson.json', JSON.stringify(rawData));

});
