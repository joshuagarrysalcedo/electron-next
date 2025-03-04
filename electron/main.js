const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const ApiHandler = require('./api-handler');

// Use dynamic import for ESM modules
let isDev = false;
import('electron-is-dev').then(module => {
  isDev = module.default;
  if (app.isReady()) {
    createWindow();
    initializeApi();
  }
});

// Load and parse the ignore patterns
const loadIgnorePatterns = () => {
  try {
    const patternsPath = isDev 
      ? path.join(__dirname, '../.next-ignore/patterns.txt')
      : path.join(process.resourcesPath, '.next-ignore', 'patterns.txt');
      
    if (fs.existsSync(patternsPath)) {
      return fs.readFileSync(patternsPath, 'utf8')
        .split('\n')
        .filter(line => line.trim() !== '');
    }
  } catch (error) {
    console.error('Error loading ignore patterns:', error);
  }
  return [];
};

// Keep a global reference to prevent window from being closed
let mainWindow;
let apiHandler;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : url.format({
        pathname: path.join(__dirname, '../out/index.html'),
        protocol: 'file:',
        slashes: true
      });

  await mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function initializeApi() {
  apiHandler = new ApiHandler({
    baseUrl: process.env.API_BASE_URL || 'https://api.example.com',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': `ElectronNextApp/${app.getVersion()}`
    }
  });

  ipcMain.on('toMain', (event, args) => {
    console.log('Received message from renderer:', args);
    event.sender.send('fromMain', {
      received: true,
      timestamp: Date.now()
    });
  });
}

app.whenReady().then(() => {
  if (isDev !== undefined) {
    createWindow();
    initializeApi();
  }
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

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});