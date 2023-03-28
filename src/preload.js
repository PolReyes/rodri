const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('triggerFunctions', {
    getNameOfSongs: 
    (pathInput) => ipcRenderer.invoke('name-songs', pathInput),
    getPathOfSongs: 
    (data) => ipcRenderer.invoke('path-songs', data)

    
})

