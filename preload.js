
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {

  ping: () => ipcRenderer.invoke('ping'),

  readJson: (callback) => ipcRenderer.on('onReadJson', async(event, args) => {
    await callback(args);
  }),

  saveNoConf: (callback) => ipcRenderer.send('setSaveNoConf', callback),

  editUser: (targetID, callback) => ipcRenderer.send('setEditUser', targetID, callback),

  onEditUser: (callback) => ipcRenderer.on('onEditUser', async(event, args, targetID) => {
    await callback(args, targetID);
  }),

  submitForm: async (formElem) => {
    const form = new FormData(formElem);
    const objForm = Object.fromEntries(form);
    console.log(objForm);

    const updateUserPromise = new Promise((resolve, reject) => {
      ipcRenderer.send('update-user', objForm);
      ipcRenderer.on('update-user-reply', (event, arg) => {
        if (arg.status === 'success') {
          resolve(arg.message);
        } else {
          reject(arg.message);
        }
      });
    });

    try {
      const message = await updateUserPromise;
      console.log(message);
    } catch (error) {
      console.error(error);
    }
  },
})

//ipcrender.send del render al main
//ipcrender.on del main al render

/**
 * const { contextBridge, ipcRenderer } = require('electron');

// Expose a limited set of Node.js APIs to the renderer process
contextBridge.exposeInMainWorld('myAPI', {
  submitForm: async (formElem) => {
    const form = new FormData(formElem);
    const objForm = Object.fromEntries(form);
    console.log(objForm);

    const updateUserPromise = new Promise((resolve, reject) => {
      ipcRenderer.send('update-user', objForm);
      ipcRenderer.on('update-user-reply', (event, arg) => {
        if (arg.status === 'success') {
          resolve(arg.message);
        } else {
          reject(arg.message);
        }
      });
    });

    try {
      const message = await updateUserPromise;
      console.log(message);
    } catch (error) {
      console.error(error);
    }
  },
});

intentar esto en el preload script a ver como funciona

In this example, we're exposing a limited set of Node.js APIs to the 
renderer process using the contextBridge module. We're creating a new 
method called submitForm, which takes the formElem parameter and handles the form submission logic.

Inside the submitForm function, we're creating a new FormData object, 
converting it to an object using Object.fromEntries, and logging it to 
the console. We're then creating a new promise called updateUserPromise 
that sends the form data to the main process using the ipcRenderer.send method. 
We're also listening for a reply from the main process using the ipcRenderer.on method.

Inside the promise, we're checking the response status from the main process, 
and if it's successful, we're resolving the promise with the response message. 
If the response is not successful, we're rejecting the promise with the error message.

Finally, we're using a try-catch block to wait for the promise to be resolved 
or rejected. If the promise is resolved, we're logging the response message to 
the console. If the promise is rejected, we're logging the error message to the console.

With this implementation, the submitForm method is now exposed to the renderer 
process and can be called from the renderer process using window.myAPI.submitForm(formElem). 
The form data is sent to the main process using the ipcRenderer.send method and the response 
is handled asynchronously using a promise. The main process can then handle the form submission 
logic and send a reply to the renderer process using the ipcMain.reply method.
 */