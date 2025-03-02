const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const isDev = process.env.NODE_ENV !== 'production';
const ApiHandler = require('./api-handler');

// Keep a global reference to prevent window from being closed
let mainWindow;
let apiHandler;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the Next.js app
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : url.format({
        pathname: path.join(__dirname, '../out/index.html'),
        protocol: 'file:',
        slashes: true
      });

  mainWindow.loadURL(startUrl);

  // DevTools are disabled by default
  // Uncomment the following line to enable DevTools in development
  // if (isDev) {
  //   mainWindow.webContents.openDevTools();
  // }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function initializeApi() {
  // Initialize the API handler
  apiHandler = new ApiHandler({
    baseUrl: process.env.API_BASE_URL || 'https://api.example.com',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': `ElectronNextApp/${app.getVersion()}`
    }
  });
  
  // Example of setting up other IPC handlers
  ipcMain.on('toMain', (event, args) => {
    // Handle general messages from renderer
    console.log('Received message from renderer:', args);
    
    // Example response
    event.sender.send('fromMain', { 
      received: true, 
      timestamp: Date.now() 
    });
  });
}

app.on('ready', () => {
  createWindow();
  initializeApi();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// App-wide error handler
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  // You might want to log errors to a file or reporting service here
});