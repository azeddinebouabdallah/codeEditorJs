
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
    }}, {
      label : 'New file',
      accelerator : process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
      click(){
        dialog.showSaveDialog((filename) => {
          if (filename === undefined){
            console.log('File undefined');
            return;
          }
          fs.writeFile(filename, '', (err) => {
            if (err) {
              console('Error with creating file');
              return;
            }
            console.log(filename);
            openNewFile(filename);
          })

        })
      }
    },{
      label: 'Save',
      accelerator: process.platform == 'darwin' ? 'Command+S' : 'Ctrl+N',
      click (){
        mainWindow.webContents.send('save');
      }
    }, {
      label: 'Save As',
      accelerator: process.platform == 'darwin'? 'Command+Shift+S' : 'Ctrl+N',
      click(){

      }
    }, {
        label : 'Close Tab',
        accelerator : process.platform == 'darwin' ? 'Command+Shift+Q' : 'Command+Shift+Q',
        click(){
              
        }
    },{
      label: 'Close Program',
      accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+F5',
      click (){
        app.quit()
      }
    },
    {label: 'Open Dev-Tools',
    accelerator: process.platform == 'darwin' ? 'Command+ù' : 'Ctrl+ù',
  click(){
    mainWindow.webContents.toggleDevTools()
  }},
  {role: 'reload'}
  ]
}, {
  label : 'Edit',
  submenu: [{
    role: 'undo'
  },{
    role: 'redo'
  },{
    type: 'separator'
  },
  {
    role: 'cut'
  },
  {
    role: 'copy'
  },
  {
    role: 'paste'
  },
  {
    label: 'selectall',
    accelerator: process.platform == 'darwin' ? 'Command+A' : 'Ctrl+A',
  }, {role: 'delete'}]
}, {
  label: 'View',
  submenu : [{role: 'togglefullscreen'}, {
    label: 'Increase Font Size',
    accelerator: process.platform == 'darwin' ? 'Command+ +' : 'Ctrl+ +',
    click(){

    }
  }, {
    label: 'Decrease Font Size',
    accelerator: process.platform == 'darwin' ? 'Command+-' : 'Ctrl+-',
    click(){

    }
  }, {
    label: 'Reset Font Size',
    accelerator: process.platform == 'darwin' ? 'Command+O' : 'Command+O',
    click (){

    }
  }]
}, {
  label: 'Find',
  submenu: [
    {
      label: 'Find in buffer',
      accelerator: process.platform == 'darwin' ? 'Command+F' : 'Ctrl+F'
    }
  ]
}, {role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'zoom'}
      ]}, {
        role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () {

           }
        }
      ]
      }
]

function readFile(filePath){
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err){
      console.log('File can\'t be opened')
      return
    }
    console.log(filePath)
    dataNew = [filePath, data]
    mainWindow.webContents.send('file', dataNew)
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

function openNewFile(filePath){
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log('Error with reading file');
        return
      }
      dataNew = [filePath, data];
      mainWindow.webContents.send('file' , dataNew);
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
