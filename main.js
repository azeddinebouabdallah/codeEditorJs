const electron = require('electron')
const app = electron.app.remote
const fs = require('fs')

const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu


const path = require('path')
const url = require('url')
const dialog = app.dialog
let mainWindow

const mainMenuTemplate = [
  { label: 'File',
  submenu: [
    {label: 'Open Directory', click(){
      dialog.showOpenDialog((filename) => {
        // Open Button
      })
    }},
    {label: 'Open Dev-Tools',
    accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
  click(){
    mainWindow.webContents.toggleDevTools()
  }},
  {role: 'reload'}
  ]
}
]



function createWindow() {
  mainWindow = new BrowserWindow({})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)

  mainWindow.on('closed', function() {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
    app.quit()
})

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
})
