
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {

  ping: () => ipcRenderer.invoke('ping'),

  readJson: (callback) => ipcRenderer.on('onReadJson', (event, args) => {
    callback(args);
  }),

  saveNoConf: (callback) => ipcRenderer.send('setSaveNoConf', callback)
})