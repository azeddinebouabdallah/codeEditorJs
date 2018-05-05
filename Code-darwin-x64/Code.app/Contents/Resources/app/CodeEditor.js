// Requirements
const electron = require('electron')
const {app, dialog, BrowserWindow, Menu, ipcRenderer, MenuItem, ipcMain, clipboard} = electron


// Node.js requirements
const path = require('path')
const url = require('url')
const fs = require('fs')
const swal = require('sweetalert2')

// Import folder class
const Folder = require(__dirname + '/Classes/folder.js')

// Main window
let mainWindow

// Name and Path of selected File (Context menu) 
let filepath;
let filename;

// Template of the Menu
const mainMenuTemplate = [
{ 
  label: 'File',
  submenu: [
    {label: 'Open File', click(){

      openDialogFile();
      
    }},{
      label: 'Open Folders', // This part is for opening a file
      click(){

        openDialogFolder();
        
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
        fs.writeFile(__dirname + '/stateOfFile.json', '[]', (err) => {
          if (err) {
            return
          }
        })
        fs.readdir(__dirname + '/Files/', (err, files) => {
          if (err) throw err;
        
          for (const file of files) {
            fs.unlink(path.join(__dirname + '/Files/', file), err => {
              if (err) throw err;
            });
          }
        });
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
  role: 'window',
      submenu: [
        {role: 'minimize'},
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

// Contexts Menus for webViews and TreeView
const ctxMenuHome = new Menu();
const ctxMenuFiles = new Menu();


// The create window (Main Function)
function createWindow() {
  mainWindow = new BrowserWindow({})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  

  var data = fs.readFileSync(__dirname +'/folderOpen.json', 'utf8', (err) => {if (err) {return}})
  if (data != ''){
  data = JSON.parse(data);
  // Create the Folder object if there is opened file
  writeFolderOpen(data.path);
  }

  // Add the Menu to the app
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)

  // If Closed
  mainWindow.on('closed', function() {
    mainWindow = null
  })
  // make the size Full Screen
  mainWindow.maximize();

  // Context Menu Inside Pages for (WebView)
  ctxMenuHome.append(new MenuItem({
    role: 'selectall',
  }))
  ctxMenuHome.append(new MenuItem({
    type: 'separator',
  }))
  ctxMenuHome.append(new MenuItem({
    role: 'copy',
  }))
  ctxMenuHome.append(new MenuItem({
    role: 'cut',
  }))
  ctxMenuHome.append(new MenuItem({
    role: 'paste',
  }))
  
  // Files Context Menu for (Tree View)
  ctxMenuFiles.append(new MenuItem({
    label: 'Copy Path',
    click(){
      // Copy path of file [get name of File and then parse the path]
      clipboard.writeText(filepath)
    }
  }))
  ctxMenuFiles.append(new MenuItem({
    type: 'separator',
  }))
  ctxMenuFiles.append(new MenuItem({
    label: 'Delete',
    click(){
      // Delete the file [Get the selected file name and then parse the path from openFolders.json and detele the file]
      deleteFile(filepath) // This function is basically deleting any path and set the new Folder (with file Deleted on it)
                          // On the folderOpen.json
      var data = fs.readFileSync(__dirname +'/folderOpen.json', 'utf8', (err) => {if (err) {return}}) // Reading the new folderOpen.json
      data = JSON.parse(data); // parse the data

      mainWindow.webContents.send('delete') // Send delete event
    }
  }))
 

}

// This function is reading the file from a filePath then send data and folder name as a file event 
function openNewFile(filePath){
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return
      }
      dataNew = [filePath, data];
      mainWindow.webContents.send('file' , dataNew);
  })
}
// This function deletes any File from a specific path
function deleteFile(path){
  var rimraf = require('rimraf');
  console.log('delete ---------')
  rimraf(path, function () { console.log('done');
  var data = fs.readFileSync(__dirname +'/folderOpen.json', 'utf8', (err) => {if (err) {return}})
  data = JSON.parse(data);
  writeFolderOpen(data.path);
 });


}

// This function read a folder path then return Json object as result which hold all sub files and folders
function getTreeData(filename) {

  var stats = fs.lstatSync(filename),
  
      info = {
          path: filename,
          name: path.basename(filename)
      };

  if (stats.isDirectory()) {
      info.type = "folder";
      info.children = fs.readdirSync(filename).map(function(child) {
          return getTreeData(filename + '/' + child); // path.join(filename, child);
      });
  } else {
      // Assuming it's a file. In real life it could be a symlink or
      // something else!
      info.type = "file";
      info.children = [];
  }

  return info;
}
// This function shows the context menu of the Tree View
function rightClickFiles(e){
  ctxMenuFiles.popup(mainWindow, e.x, e.y);
}
// This function shows the context menu of the WebViews
function rightClickHome(e){
    console.dir(e);
    ctxMenuHome.popup(mainWindow, e.x, e.y);
}
// This functions shows the Open Folder Dialog (Open Folder)
function openDialogFolder(){
  dialog.showOpenDialog({
    properties: ['openDirectory', 'promptToCreate'],
  }, (foldername) => {
    if (foldername === undefined){return}

    

    writeFolderOpen(foldername[0]);
    mainWindow.webContents.send('folder');
  });
}
// This functions shows the Open File Dialog (Open File)
function openDialogFile(){
  dialog.showOpenDialog((fileNames) => {
    if (fileNames === undefined){
      console.log('File undefined')
    }else {
      readFile(fileNames[0])
    }
  })
}

// !!!! Questionable Part -- Reason : I've never used this function !!!!
/*
function getNewFoldersWhenOpen(){
    var data = fs.readFileSync('./folderOpen.json', 'utf8', (err) => {if (err) {return}})
    data = JSON.parse(data);
    writeFolderOpen(data.path)
}
*/

// Function that create the Folder object and launch the createFolder function that write the folderOpen.json
function writeFolderOpen(path){
  var dataa = getTreeData(path);
  dataa = JSON.stringify(dataa, null, 2)

  let folder = new Folder(dataa.name, dataa.path, dataa);

  folder.createFolder(__dirname + '/folderOpen.json');
}

// readFile function that read the file from a path and send Data as file event
function readFile(filePath){
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err){
      return
    }
    dataNew = [filePath, data]
    mainWindow.webContents.send('file', dataNew)
  })
}

/* *********  Receiving events part  *********  */

// event of right click for the webviews
ipcMain.on('home_page_right_click', (e)=>{
  rightClickHome(e);
})
/*
ipcMain.on('files_right_click', (e) => {
  rightClickFiles(e);
})
*/

// Event of right click for the TreeView
ipcMain.on('right_click_file', (e, elem) => {
    filepath = elem.path;
    filename = elem.name
    rightClickFiles(e);

})

// The launch of our application
app.on('ready', createWindow)

// Close all Window = (quit)
app.on('window-all-closed', function() {
  // set Empty to stateOfFile
  fs.writeFile(__dirname +'/stateOfFile.json', '[]', (err) => {
    if (err) {
      return
    }
  })

  // Delete all Sub files of Files Directory
  fs.readdir(__dirname + '/Files/', (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(__dirname +'/Files/', file), err => {
        if (err) throw err;
      });
    }
  });

    app.quit()
})

// Activate event if there is no window create it
app.on('closeSave', function() {
  if (mainWindow === null) {
    createWindow()
  }
})
