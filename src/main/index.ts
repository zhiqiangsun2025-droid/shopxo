import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import url from 'node:url';

let mainWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../renderer/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC example
ipcMain.handle('engine:ping', async () => {
  try {
    // Lazy-load native addon; try several likely paths
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let engine: any;
    const candidates = [
      path.resolve(__dirname, '../../native/build/CopyEngine.node'),
      path.resolve(process.cwd(), 'native/build/CopyEngine.node'),
      path.resolve(__dirname, '../../../native/build/CopyEngine.node'),
    ];
    for (const p of candidates) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        engine = require(p);
        break;
      } catch {}
    }
    if (!engine) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      engine = require('node-gyp-build')(__dirname);
    }
    return engine.ping();
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
});
