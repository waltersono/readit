// Modules
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const readItem = require("./readItem");
const appMenu = require("./menu");

const windowStateKeeper = require("electron-window-state");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Listen on new item added
ipcMain.on("new-item", (e, itemUrl) => {
  readItem(itemUrl, (item) => {
    e.sender.send("new-item-success", item);
  });
});

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  // Set the initial values for the state window
  const state = windowStateKeeper({
    defaultHeight: 500,
    defaultWidth: 400,
  });

  mainWindow = new BrowserWindow({
    width: state.width,
    height: state.height,
    x: state.x,
    y: state.y,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile("renderer/main.html");

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Manage main window state
  state.manage(mainWindow);

  mainWindow.webContents.on("context-menu", (e) => {
    Menu.buildFromTemplate([
      {
        label: "Open",
        accelerator: "CmdOrCtrl+O",
        click: () => {
          mainWindow.webContents.send("menu-open");
        },
      },
      {
        label: "Delete",
        accelerator: "CmdOrCtrl+S",
        click: () => {
          mainWindow.webContents.send("menu-delete");
        },
      },
    ]).popup();
  });

  appMenu(mainWindow.webContents);

  // Listen for window being closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Electron `app` is ready
app.on("ready", createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
