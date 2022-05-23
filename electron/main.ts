import { app, BrowserWindow } from 'electron';
import { fork } from 'child_process';
import * as path from 'path';
import findOpenSocket from './find-open-socket';
import { ipcMain, MessageChannelMain } from 'electron/main';

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
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  // Open the DevTools
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  return mainWindow;
}

function createBackgroundWindow(): BrowserWindow {
  const win = new BrowserWindow({
    x: 500,
    y: 300,
    width: 700,
    height: 500,
    show: isDev, // shows window in dev, hides otherwise
    webPreferences: {
      preload: path.join(__dirname, 'server-preload.js'),
      nodeIntegration: true
    }
  })
  win.loadURL(`file://${__dirname}/server-dev.html`);

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools();
  }

  return win;
}

function createBackgroundProcess(socketName: string) {
  const serverProcess = fork(__dirname + '/server.js', [
    '--subprocess',
    app.getVersion(),
    socketName
  ]);

  serverProcess.on('message', msg => {
    console.log(msg)
  });

  app.on('before-quit', () => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  const serverSocket = await findOpenSocket();
  const mainWindow = createMainWindow();
  const serverWindow = createBackgroundWindow();

  ipcMain.on('connect-to-collector', (event) => {
    if (event.senderFrame === mainWindow.webContents.mainFrame) {
      const { port1, port2 } = new MessageChannelMain();
      serverWindow.webContents.postMessage('new-client', null, [port1]);
      event.senderFrame.postMessage('collector-message-port', null, [port2]);
    }
  });

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 1) createMainWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
