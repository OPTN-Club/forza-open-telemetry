import { contextBridge, ipcRenderer } from 'electron';
import { AddressInfo } from 'net';

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector: string, text: string | undefined) => {
//     const element = document.getElementById(selector);
//     if (element) element.innerText = text || '';
//   }

//   for (const dependency of ['chrome', 'node', 'electron']) {
//     replaceText(`${dependency}-version`, process.versions[dependency]);
//   }
// });

// const socketPromise = new Promise<string>((resolve) => {
//   ipcRenderer.on('set-socket', (event, { name }) => {
//     resolve(name);
//   });
// });

// function ipcConnect(): Promise<NodeIpcClient> {
//   return socketPromise.then((name) => {
//     return new Promise((resolve) => {
//       ipc.config.silent = true;
//       ipc.connectTo(name, () => {
//         resolve(ipc.of[name]);
//       });
//     });
//   })
// }

// Makes the ipcConnect function available in the client
// window.ipcConnect = ipcConnect;
