//import smalltalk from 'node_modules/smalltalk/legacy';
//const Dialogs = require('dialogs')
//let dialogs = Dialogs()

const electron = require('electron')
const {app, dialog, BrowserWindow, Menu, ipcRenderer} = electron
const fs = require('fs')




const path = require('path')
const url = require('url')

let mainWindow

const mainMenuTemplate = [
  { label: 'File',
  submenu: [
    {label: 'Open Directory', click(){

      dialog.showOpenDialog((fileNames) => {
        if (fileNames === undefined){
          console.log('File undefined')
        }else {
          readFile(fileNames[0])
        }
      })
      //dialog.showOpenDialog((filename) => {
        // Open Button
      //})
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

function readFile(filePath){
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err){
      console.log('File can\'t be opened')
      return
    }

    mainWindow.webContents.send('file', data)
  })
}

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
