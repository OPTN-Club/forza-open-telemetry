import { app, BrowserWindow } from 'electron';
import path from 'path';

const isDev = process.env.IS_DEV === "true"; // ? true : false;

function createMainWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1820,
    height: 1024,
    webPreferences: {
      preload: path.join(__dirname, 'client-preload.js'),
      nodeIntegration: false,
    },
  });

  // In dev, use the vite server
  // Otherwise load the compiled index.html
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3333'
      : `file://${path.join(__dirname, '../index.html')}`
  );

  // Open the DevTools
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 1) createMainWindow();
  });
  createMainWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
