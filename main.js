
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
    }},{
      label: 'Open Folders', // This part is for opening a file
      click(){
        dialog.showOpenDialog({
          properties: ['openDirectory', 'promptToCreate'],
        }, (foldername) => {
          if (foldername === undefined){return}

         
          var dataa = dirTree(foldername[0]);
          dataa = JSON.stringify(dataa, null, 2)

          fs.writeFile('Files/folderOpen.json', dataa, (err) => {
            if (err) {return}
          mainWindow.webContents.send('folder');
          })
        });
      }
    }
    , {
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
              console.log('Error with creating file');
              return;
            }
            console.log(filename);
            openNewFile(filename);
          })

        })
      }
    },{
      label: 'Save',
      accelerator: process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
      click (){
        mainWindow.webContents.send('save');
      }
    }, {
      label: 'Save As',
      accelerator: process.platform == 'darwin'? 'Command+Shift+S' : 'Ctrl+Shift+S',
      click() {
        var savePath = dialog.showSaveDialog((filename) => {
          if (filename === undefined){
            console.log('Filename undefined (Save as)')
          }else {
          data = filename;
          console.log(data + + ': FILE NAME \n')

          mainWindow.webContents.send('saveas', data);
          }
        })
      }
    }, {
        label : 'Close Tab',
        //accelerator : process.platform == 'darwin' ? 'Command+Shift+Q' : 'Command+Shift+Q',
        click(){
              mainWindow.webContents.send('closetab')
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
    click(){
      mainWindow.webContents.send('selectall')
    }
  }]
}, {
  label: 'View',
  submenu : [{role: 'togglefullscreen'}, 
  {
    label: 'Increase Font Size',
    accelerator: process.platform == 'darwin' ? 'Command+ +' : 'Ctrl+ +',
    click(){
        mainWindow.webContents.send('increasefontsize')
    }
  }, {
    label: 'Decrease Font Size',
    accelerator: process.platform == 'darwin' ? 'Command+-' : 'Ctrl+-',
    click(){
        mainWindow.webContents.send('decreasefontsize')
    }
  }, {
    label: 'Reset Font Size',
    accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
    click (){
      mainWindow.webContents.send('resetfontsize')
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


function dirTreerrr(filename) {
  console.log('FileName: ' + filename);
  info = {
    path: filename,
    name: path.basename(filename)
  };
  fs.readdir(filename, (err, files) => {
    console.log('Files: ' + files);
    files.forEach((file) => {
      if (fs.lstatSync(path.join(filename,file)).isDirectory()){
        console.log('In progress: Folder')
        info.type = 'folder';
        info.children = fs.readdirSync(filename).map(function(child) {
          return dirTree(path.join(filename, child));
        });
      }else {
        console.log('In progress: File')
        info.type = "file";
      }
      console.log('returns: ' + info)
    });
  })
  return info;
}

function dirTree(filename) {

  var stats = fs.lstatSync(filename),
  
      info = {
          path: filename,
          name: path.basename(filename)
      };

  if (stats.isDirectory()) {
      info.type = "folder";
      info.children = fs.readdirSync(filename).map(function(child) {
          return dirTree(filename + '/' + child); // path.join(filename, child);
      });
  } else {
      // Assuming it's a file. In real life it could be a symlink or
      // something else!
      info.type = "file";
      info.children = [];
  }

  return info;
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
