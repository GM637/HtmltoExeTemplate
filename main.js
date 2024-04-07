const path = require('path');
const { app, BrowserWindow, Menu, session } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true, // Enable context isolation
      worldSafeExecuteJavaScript: true, // Enable world safe execute JavaScript
    },
    icon: path.join(__dirname, 'favicon.ico') // Set the window icon
  });

  // Add the following lines to set the necessary Electron switches
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
      }
    });
  });

  win.loadFile('index.html');

  // Hide the menu bar
  Menu.setApplicationMenu(null);
}

app.whenReady().then(() => {
  app.on('web-contents-created', (event, contents) => {
    contents.on('will-attach-webview', (event, webPreferences, params) => {
      // Disable the same-origin policy in webview
      delete webPreferences.webSecurity;
      webPreferences.allowRunningInsecureContent = true;
    });
  });

  createWindow();
});
