const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    // Example of exposing IPC methods
    send: (channel, data) => {
      // whitelist channels
      const validChannels = ['toMain', 'api-request', 'logout'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      const validChannels = ['fromMain', 'api-response', 'auth-status'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    // Add any app info or environment variables you want to expose
    appInfo: {
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
      environment: process.env.NODE_ENV
    }
  }
);