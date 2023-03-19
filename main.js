const {
  app,
  BrowserWindow,
  Menu,
  dialog,
  shell,
  ipcMain,
} = require("electron");
const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");
const _ = require("lodash");

let directorio = [];
let archivo = [];
let message = "";

const targetFullPath = path.join(__dirname + "/exportacion/");

// const showMesagge = () => {
//   message.innerHTML("exito!");
// };

function createJsonWindow() {
  const jsonViewer = new BrowserWindow({
    width: 1300,
    height: 1000,
    minWidth: 600,
    minHeight: 400,
    title: "Parent",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  jsonViewer.loadFile("JsonView.html");
  jsonViewer.webContents.send("onReadJson", "read")
  jsonViewer.webContents.openDevTools();
}

const restartApp = () => {
  app.relaunch();
  app.quit();
};

const createDatabase = (directorio) => {
  const date = new Date();
  const localDate = date.toLocaleString().replace(/[,:/]/g, "-");
  //conseguir el directorio donde estan los archivos
  const directoryPath = directorio.split(path.sep).join(path.posix.sep);
  //const directoryPath1 = path.join(__dirname + "../../", "Database/");
  var rawData = [];

  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      message = "Ocurrio un error al leer el directorio";
      return dialog.showMessageBox({
        message: message,
        type: "info",
      });
    }

    //listing all files using forEach
    files.forEach(function (file) {
      // para cada archivo se crea un libro de excel
      const workBook = xlsx.readFile(`${directoryPath}/${file}`);
      // de cada libro se consigue la primera "hoja"
      const sheet = workBook.Sheets["Sheet1"];
      // se juntan los datos de todas las hojas de cada libro
      rawData = rawData.concat(xlsx.utils.sheet_to_json(sheet, { header: 2 }));
    });

    fs.writeFileSync("./Database/RAWdatajson.json", JSON.stringify(rawData));
    const jsonData = JSON.parse(
      fs.readFileSync("./Database/RAWdatajson.json", "utf8")
    );

    const unique = [];
    for (const item of jsonData) {
      const isDuplicate = unique.find((obj) => obj.cedula === item.cedula);
      if (!isDuplicate) {
        unique.push(item);
      }
      if (typeof item.cel === "number") {
        item.cel = "0" + item.cel.toString();
      }
    }

    fs.writeFileSync("./Database/OKdatajson.json", JSON.stringify(unique));
    message = "Base de datos creada con exito";
    console.log(message);

    dialog
      .showMessageBox({
        message: message,
        type: "info",
      })
      .then(() => {
        restartApp();
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const createExcelFile = (targetFile) => {
  const OKdatajson = JSON.parse(
    fs.readFileSync("./Database/OKdatajson.json", "utf8")
  );
  // PASO 1
  //cambiar el directorio
  const targetFilePath = targetFile.split(path.sep).join(path.posix.sep);
  const workBook = xlsx.readFile(targetFilePath);
  const sheet = workBook.Sheets["Sheet1"];
  const targetData = xlsx.utils.sheet_to_json(sheet, { header: 2 });

  //PASO 2
  const matchingData = _.intersectionBy(OKdatajson, targetData, "cedula");

  //PASO 3
  fs.writeFileSync("./OKtargetDatajson.json", JSON.stringify(matchingData));

  //PASO 4
  //leer archivo json y crear el excel
  const jsonData = JSON.parse(
    fs.readFileSync("./OKtargetDatajson.json", "utf8")
  );
  //crear un workbook
  const newWorkBook = xlsx.utils.book_new();

  //crear las sheets(hojas)
  const newSheet = xlsx.utils.json_to_sheet(jsonData);

  //agregar la sheet recien creada al libro creado antes(workBook)
  xlsx.utils.book_append_sheet(newWorkBook, newSheet, "usuarios");

  //escribir la data en el excel
  const date = new Date();
  const localDate = date.toLocaleString().replace(/[,:/]/g, "-");

  xlsx.writeFile(newWorkBook, `./exportacion/${localDate}-exportacion.xlsx`);

  message = "Archivo excel exportado con exito";
  dialog
    .showMessageBox({
      message: message + localDate,
      type: "info",
      buttons: ["Ok", "Mostrar en carpeta", "Continuar"],
    })
    .then((result) => {
      if (result.response === 1) {
        shell.openPath(targetFullPath);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const menuItems = [
  {
    label: "Menu",
    submenu: [
      {
        label: "Nuevo archivo",
        click: () => {
          dialog
            .showOpenDialog({
              filters: [
                {
                  name: "archivo de excel",
                  extensions: ["xls"],
                },
              ],
              title: "Elije el archivo a exportar",
              properties: ["openFile"],
            })
            .then((result) => {
              if (result.filePaths.length > 0) {
                archivo = result.filePaths[0];
                createExcelFile(archivo);
              } else {
                console.log("no se elijio ningun archivo");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
      },
      {
        label: "Cargar base de datos",
        click: () => {
          dialog
            .showOpenDialog({
              properties: ["openDirectory"],
            })
            .then((result) => {
              if (result.filePaths.length > 0) {
                directorio = result.filePaths[0];
                createDatabase(directorio);
              } else {
                console.log("No se elijio ningun directorio");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
      },
      {
        label: "Salir",
        click: () => app.quit(),
      },
    ],
  },
  {
    label: "Extras",
    submenu: [
      {
        role: "toggleDevTools",
      },
    ],
  },
  {
    label: "Archivos de datos",
    submenu: [
      {
        label: "RAW json",
        click: () => {
          createJsonWindow();

          // createNewWindow();
          // jsonViewer.setMenu(null);
          // ipcMain.on("onReadJson", () => {
          //   fs.readFile(
          //     "./Database/OKdatajson.json",
          //     "utf8",
          //     function (err, data) {
          //       if (err) {
          //         return console.log(err);
          //       }
          //       console.log(data);
          //     }
          //   );
          // });

          // jsonViewer.on("closed", function () {
          //   jsonViewer = null;
          // });
        },
      },
      {
        label: "json filtrado",
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(menuItems);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 680,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("ping", () => {
    if (fs.existsSync("./Database/OKdatajson.json")) {
      return "OK";
    } else {
      return "Error";
    }
  });

  Menu.setApplicationMenu(menu);

  win.loadFile("index.html");
};

app.getVersion();

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
