const fs = require("fs");
const { isNumber, isString } = require("lodash");
let newkey = "documento";

//filtrar por usuario repetido
//agregar numero 0 al celular del usuario

const jsonData = JSON.parse(fs.readFileSync("./Database/RAWdatajson.json", "utf8"));

// console.log(jsonData);

const unique = [];
for (const item of jsonData) {
  const isDuplicate = unique.find((obj) => obj["Numero de Documento"] === item["Numero de Documento"]);
  if (!isDuplicate) {
    Object.keys(item).forEach((elem) => {
      if (isString(item[elem])){
        item[elem] = item[elem].trim()
      }
    })
    unique.push(item);
  }
  if (isNumber(item.Celular)) {
    item.Celular = "0" + item.Celular.toString();
  }
}

console.log(unique);

// console.log(unique);

// console.log(unique);
fs.writeFileSync('./OKdatajson.json', JSON.stringify(unique));
