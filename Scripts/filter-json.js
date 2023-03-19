const fs = require("fs");

//filtrar por usuario repetido
//agregar numero 0 al celular del usuario

const jsonData = JSON.parse(fs.readFileSync('./RAWdatajson.json', 'utf8'));

// console.log(jsonData);

const unique = [];
for (const item of jsonData) {
  const isDuplicate = unique.find((obj) => obj.cedula === item.cedula);
  if (!isDuplicate) {
    unique.push(item);
  }
  if (typeof(item.cel) === 'number'){
    item.cel = "0" + item.cel.toString();
  }
}

fs.writeFileSync('./OKdatajson.json', JSON.stringify(unique));