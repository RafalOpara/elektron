const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;
let contacts = [];

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Dodaj tę opcję, aby umożliwić dostęp do obiektów globalnych Node.js w rendererze
    }
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

ipcMain.on('addContact', (event, contact) => {
  console.log('Received addContact request:', contact);
  contacts.push(contact);
  updateContacts();
});

ipcMain.on('getContacts', (event) => {
  console.log('Received getContacts request');
  updateContacts();
});

ipcMain.on('deleteContact', (event, index) => {
  console.log('Received deleteContact request:', index);
  contacts.splice(index, 1);
  updateContacts();
});

function updateContacts() {
  mainWindow.webContents.send('showContacts', contacts);
}
