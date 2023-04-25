
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {

  ping: () => ipcRenderer.invoke('ping'),

  readJson: (callback) => ipcRenderer.on('onReadJson', async(event, args) => {
    await callback(args);
  }),

  saveNoConf: (callback) => ipcRenderer.send('setSaveNoConf', callback),

  editUser: (callback) => ipcRenderer.send('setEditUser', callback),

  onEditUser: (callback) => ipcRenderer.on('onEditUser', async(event, args) => {
    await callback(args);
  }),
})