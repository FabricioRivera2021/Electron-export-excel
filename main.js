const { app, BrowserWindow, Menu, dialog, shell, ipcMain, webContents } = require("electron");
const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");
const { _, isString, isNumber } = require("lodash");

let directorio = [];
let archivo = [];
let message = "";

const targetFullPath = path.join(__dirname + "/exportacion/");

// const showMesagge = () => {
//   message.innerHTML("exito!");
// };

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
      // console.log(file);
      // para cada archivo se crea un libro de excel
      const workBook = xlsx.readFile(`${directoryPath}/${file}`);
      // de cada libro se consigue la primera "hoja"
      const sheet = workBook.Sheets["Hoja1"];
      // console.log(sheet);
      // se juntan los datos de todas las hojas de cada libro
      rawData = rawData.concat(xlsx.utils.sheet_to_json(sheet, { range: 1, defval: "" }));
      // console.log(rawData)
    });

    fs.writeFileSync("./Database/RAWdatajson.json", JSON.stringify(rawData));

    const jsonData = JSON.parse(fs.readFileSync("./Database/RAWdatajson.json", "utf8"));

    const unique = [];
    let id = 0;
    for (const item of jsonData) {
      const isDuplicate = unique.find((obj) => obj["Numero de Documento"] === item["Numero de Documento"]);
      if (!isDuplicate) {
        Object.keys(item).forEach((elem) => {
          if (isString(item[elem])) {
            item[elem] = item[elem].trim();
          }
        });
        item.id = id;
        id ++;
        unique.push(item);
      }
      if (isNumber(item.Celular)) {
        item.Celular = "0" + item.Celular.toString();
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
  const OKdatajson = JSON.parse(fs.readFileSync("./Database/OKdatajson.json", "utf8"));
  // PASO 1
  //cambiar el directorio
  const targetFilePath = targetFile.split(path.sep).join(path.posix.sep);
  const workBook = xlsx.readFile(targetFilePath);
  const sheet = workBook.Sheets["Hoja1"];
  const targetData = xlsx.utils.sheet_to_json(sheet, { range: 1, defval: "" });

  //PASO 2
  const matchingData = _.intersectionBy(OKdatajson, targetData, "Numero de Documento");

  //PASO 3
  fs.writeFileSync("./OKtargetDatajson.json", JSON.stringify(matchingData));

  //PASO 4
  //leer archivo json y crear el excel
  const jsonData = JSON.parse(fs.readFileSync("./OKtargetDatajson.json", "utf8"));
  //crear un workbook
  const newWorkBook = xlsx.utils.book_new();

  //crear las sheets(hojas)
  const newSheet = xlsx.utils.json_to_sheet(jsonData);

  //agregar la sheet recien creada al libro creado antes(workBook)
  xlsx.utils.book_append_sheet(newWorkBook, newSheet, "Hoja1");

  //escribir la data en el excel
  const date = new Date();
  const localDate = date.toLocaleString().replace(/[,:\s/]/g, "-");

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

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 680,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

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
          label: "Base de datos",
          click: () => {
            const jsonViewer = new BrowserWindow({
              width: 1400,
              height: 550,
              show: false,
              webPreferences: {
                preload: path.join(__dirname, "preload.js"),
              },
            });

            const OKdatajson = JSON.parse(fs.readFileSync("./Database/OKdatajson.json", "utf8"));
            if (OKdatajson) {
              jsonViewer.loadFile("./src/pages/JsonView.html");
              jsonViewer.maximize(true);
              jsonViewer.webContents.send("onReadJson", OKdatajson);
              jsonViewer.webContents.openDevTools();
              jsonViewer.on("ready-to-show", jsonViewer.show);
            }
          },
        },
      ],
    },
    {
      label: "No conformidad",
      submenu: [
        {
          label: "Nueva",
          click: () => {
            const noConfViewer = new BrowserWindow({
              width: 1024,
              height: 720,
              autoHideMenuBar: true,
              webPreferences: {
                preload: path.join(__dirname, "preload.js"),
              },
            });

            noConfViewer.loadFile("./src/pages/noConformidad.html");
          },
        },
        {
          label: "Ver no conformidades ya realizadas",
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuItems);

  ipcMain.handle("ping", () => {
    if (fs.existsSync("./Database/OKdatajson.json")) {
      return "OK";
    } else {
      return "Error";
    }
  });

  Menu.setApplicationMenu(menu);

  win.loadFile("src/index.html");
};

app.getVersion();

app.whenReady().then(() => {
  createWindow();

  ipcMain.on("setSaveNoConf", (event, args) => {
    const json = JSON.parse(args);
    console.log(json);

    const saveNoConfViewer = new BrowserWindow({
      width: 1024,
      height: 720,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });

    saveNoConfViewer.loadFile("./src/pages/saveNoConf.html");
  });

  ipcMain.on("setEditUser", (event, targetID, args) => {
    const user = args;
    const userID = targetID;

    const jsonViewer = BrowserWindow.getFocusedWindow();

    const editUser = new BrowserWindow({
      parent: jsonViewer,
      modal: true,
      show: false,
      width: 900,
      height: 720,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });

    console.log(user);
    editUser.loadFile("./src/pages/editUser.html");
    editUser.webContents.send("onEditUser", user, userID);
    editUser.webContents.openDevTools();
    editUser.setMenu(null);
    editUser.on("ready-to-show", editUser.show);
  });

  ipcMain.on("update-user", (event, args) => {
    const OKdatajson = JSON.parse(fs.readFileSync("./Database/OKdatajson.json", "utf8"));
    /* Solo necesitamos encontrar el registro que tenga el mismo id en ambos casos.. */
    const user = OKdatajson[args.id];

    // Modify the email property
    user["Numero de Documento"] = args.ci;
    user["Nombre Destinatario"] = args.nombre;
    user["Departamento"] = args.depto;
    user["Localidad/Barrio"] = args["loc/barr"];
    user["Calle"] = args.calle;
    user["Celular"] = args.cel;
    user["Observaciones"] = args.observaciones;

    //console.log(args);
    // Save the changes back to the JSON file
    fs.writeFileSync("./Database/OKdatajson.json", JSON.stringify(OKdatajson));

    event.reply("update-user-reply", { status: "success", message: "User updated successfully" });
  });

  ipcMain.on("search-user", (event, user) => {
    const OKdatajson = JSON.parse(fs.readFileSync("./Database/OKdatajson.json", "utf8"));
    const searchUser = user;

    const results = _.filter(OKdatajson, (item) => {
      const nameMatch = item['Nombre Destinatario'].toLowerCase().includes(searchUser.toLowerCase());
      const idMatch = item['Numero de Documento'].toString().includes(searchUser);
      return nameMatch || idMatch;
    });

    console.log(results);
    event.reply("search-user-reply", { status: "success", message: results });    
  });

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
