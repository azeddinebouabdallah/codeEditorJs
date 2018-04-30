const TabGroup = require("electron-tabs");
const electron = require('electron')
const {ipcRenderer} = electron
const fs = require('fs')


let tabGroup = new TabGroup();
let filePath;

let filesOpened = new Array();


var root = JSON.parse(fs.readFileSync('./Files/folderOpen.json', 'utf8', (err) => {
  if (err) {
    console.log(err);
  }
}));

var tree = require('electron-tree-view')({
root,
container: document.querySelector('#jstree_demo_div'),
children: c => c.children,
label: c => c.name
})


class File {

constructor(fileName, filePath, content, exe, dateOfCreation){

  this.fileName = fileName;
  this.filePath = filePath;
  this.exe = exe;
  this.dateOfCreation = dateOfCreation;
  this.content = content;

}
createFile() {

    var extention = this.exe;
    var dfc = this.dateOfCreation;
    console.log ('the file exe : ' + this.exe)
    var data = {
      filename : this.fileName, 
      filePath : this.filePath,
      fileexe : this.exe,
      fileDate : this.dateOfCreation,
      fileContent : this.content
    }
    var JSONData = data;
    
    var code = JSON.stringify(JSONData, null, 2);
    fs.writeFile('Files/'+ this.fileName +'.json', code, (err) => {console.log(err)})
    var newData = this.content.split('\n');

    var newOrgData = '';

    if (this.exe == 'html' || this.exe == 'xml') {
      console.log('Html or Xml file')
      for (var i = 0; i<newData.length;i++){
        if (i != newData.length - 1){
          var asciiDataI = newData[i].replace(/>/g, '&gt;').replace(/</g, '&lt;');
          newOrgData += asciiDataI + '\n';
        }
        else {
          asciiDataI = newData[i].replace(/>/g, '&gt;').replace(/</g, '&lt;');
          newOrgData += asciiDataI + '\n';
        }

    }
      var newPage = '<!DOCTYPE html>\n'+
      '<html lang="en" dir="ltr">\n'+
      '<head>\n'+
        '<meta charset="utf-8">\n'+
        '<script src="../codemirror/lib/codemirror.js"></script>\n'+
        '<link rel="stylesheet" href="../codemirror/lib/codemirror.css">\n'+
        '<link rel="stylesheet" href="../codemirror/theme/material.css">\n'+
        '<script src="../codemirror/mode/xml/xml.js"></script>\n'+
      '</head>\n'+
      '<body>\n'+
      '<textarea class="codemirror-textarea" id="codemirror" nodeintegration>\n' +
       newOrgData +
      '</textarea>\n'+
      '<script type="text/javascript">\n' +
      'var textArea = document.getElementById(\'codemirror\');\n' +
      'var editor = CodeMirror.fromTextArea(textArea, {\n' +
        'lineNumbers: true,\n' +
        'mode: "xml",\n' +
       ' htmlMode: true,\n' +
        'theme: "material",\n' +
      '});\n' +
      '</script>\n' +
     ' <script src="../JS/require.js"></script>\n' +
      '<script src="../JS/requires.js"></script>\n' +
      '</body>\n'+
      '</html>';

  }else if (this.exe == 'css') {

    for (var i = 0; i<newData.length;i++){
      console.log('Css file')
      if (i != newData.length - 1){
        newOrgData += newData[i] + '\n';
      }
      else {
          newOrgData += newData[i] + '\n';
      }

  }

    var newPage = '<!DOCTYPE html>\n'+
    '<html lang="en" dir="ltr">\n'+
    '<head>\n'+
      '<meta charset="utf-8">\n'+
      '<script src="../codemirror/lib/codemirror.js"></script>\n'+
      '<link rel="stylesheet" href="../codemirror/lib/codemirror.css">\n'+
      '<link rel="stylesheet" href="../codemirror/theme/material.css">\n'+
      '<script src="../codemirror/mode/css/css.js"></script>\n'+
    '</head>\n'+
    '<body>\n'+
    '<textarea class="codemirror-textarea" id="codemirror" nodeintegration>\n' +
     newOrgData +
     '</textarea>\n'+
     '<script type="text/javascript">\n' +
     'var textArea = document.getElementById(\'codemirror\');\n' +
     'var editor = CodeMirror.fromTextArea(textArea, {\n' +
       'lineNumbers: true,\n' +
       'mode: "css",\n' +
       'theme: "material",\n' +
     '});\n' +
     '</script>\n' +
    ' <script src="../JS/require.js"></script>\n' +
     '<script src="../JS/requires.js"></script>\n' +
     '</body>\n'+
     '</html>';

  }else {
    console.log('Other file')
    for (var i = 0; i<newData.length;i++){
      if (i != newData.length - 1){
        newOrgData += newData[i] + '\n';
      }
      else {
          newOrgData += newData[i] + '\n';
      }

  }
    var newPage = '<!DOCTYPE html>\n'+
    '<html lang="en" dir="ltr">\n'+
    '<head>\n'+
      '<meta charset="utf-8">\n'+
      '<script src="../codemirror/lib/codemirror.js"></script>\n'+
      '<link rel="stylesheet" href="../codemirror/lib/codemirror.css">\n'+
      '<link rel="stylesheet" href="../codemirror/theme/material.css">\n'+

    '</head>\n'+
    '<body>\n'+
    '<textarea class="codemirror-textarea" id="codemirror" nodeintegration>\n' +
     newOrgData +
     '</textarea>\n'+
     '<script type="text/javascript">\n' +
     'var textArea = document.getElementById(\'codemirror\');\n' +
     'var editor = CodeMirror.fromTextArea(textArea, {\n' +
       'lineNumbers: true,\n' +
       'mode: "xml",\n' +
      ' htmlMode: true,\n' +
       'theme: "material",\n' +
     '});\n' +
     '</script>\n' +
    ' <script src="../JS/require.js"></script>\n' +
     '<script src="../JS/requires.js"></script>\n' +
     '</body>\n'+
     '</html>';
  }

  fs.writeFile('Files/'+ this.fileName +'.html', newPage, (err) => {
    console.log(err)
  })
  
  addTab(this.fileName);


}

}

ipcRenderer.on('file', (e, item) => {
  openFile(item);
})

ipcRenderer.on('save', (e) => {

  saveFile();
  
})

ipcRenderer.on('saveas', (e, filePath) => {

    // Get the current tab
    var currentTab = tabGroup.getActiveTab();

    // Get the title of the Tab
    var name = currentTab.getTitle();

    // Read the JSON file of the activated tab and parse it into **jsonFileContent variable
    var jsonFile = fs.readFileSync('Files/' + name + '.json', 'utf8', (err) => {});
    var jsonFileContent = JSON.parse(jsonFile);
    
    // Get the content from the JSON file 
    var newSavedData = jsonFileContent.fileContent
    /* Buffer the path so it can be used in fs.write IDK why in this func it said to me that you need to buufer
    so you'll not find any Path Buffer in other writing files */
    var path = Buffer.from(filePath, 'utf8');
    console.log('Filename: ' + name + '\n Filepath : ' + path);
    // Write the new file
    fs.writeFile(path, newSavedData, (err) => {
      if (err) {
        console.log('Error with saving file as')
        return
      }
    })

    

})

ipcRenderer.on('closetab', (e) => {
  
    // Get the current active Tab and close it
    var activeTab = tabGroup.getActiveTab();
    console.log('Name of Tab: ' + activeTab.getTitle())
    activeTab.close(true);
})

 /* !!!!!!!!!!!!!!!!!!!!!!!!!!  NEED TO FIX ERROR  !!!!!!!!!!!!!!!!!!!!!!!!!!*/
ipcRenderer.on('selectall', (e) => {

  // Get the current tab and the title
  var activeTab = tabGroup.getActiveTab();
  var nameOfTab = activeTab.getTitle();
 
  // Get access to the webview of the activated tab and select all the content of the webView
  //activeTab.EventListener('dom-ready', () => {
  //webview.selectAll()
  //})
})

ipcRenderer.on('increasefontsize', (e) => { 

  // Get the param JSON File and parse it into **param variable
  var param = fs.readFileSync('./param.json', 'utf8', (err) => {})
  param = JSON.parse(param)

  
  fontSize = param.fontsize + 1 ; //Increase the font size of our local variable

  param.fontsize += 1; // Increase the font size of our global DATA Json Data

  //Stringify and write the new params
  var param = JSON.stringify(param);
  fs.writeFile('./param.json', param, (err) => {

  })


  // Read the CodeMirror Css file 
  var codeMirrorCss = fs.readFileSync('codemirror/lib/codemirror.css','utf8' , (err) => {
    if (err){
      console.log('Error with reading CodeMirror css file');
      return;
    }
  })

  // Add the font Size property to CODEMirror text
  codeMirrorCss += '.CodeMirror {font-size :  ' + fontSize + 'px  }'
 
  // Rewrite the CodeMirror Css
  console.log ('File Added: ' + codeMirrorCss);
  fs.writeFile('./codemirror/lib/codemirror.css', codeMirrorCss, (err) => {
    if (err) {
      console.log('Error with writing the CodeMirror css file')
    }
  })

  // Reload each tab so the new CSS takes a place
  tabGroup.eachTab((ctab, index, tabCollection) => {
    var webview = ctab.webview;
    webview.reload();
  })

})

ipcRenderer.on('decreasefontsize', (e)=> {

  // Get the param JSON File and parse it into **param variable
  var param = fs.readFileSync('./param.json', 'utf8', (err) => {})
  param = JSON.parse(param)

  fontSize = param.fontsize - 1 ; //Decrease the font size of our local variable

  param.fontsize -= 1; // Decrease the font size of our global DATA Json Data

  //Stringify and write the new params
  var param = JSON.stringify(param);
  fs.writeFile('./param.json', param, (err) => {})

  // Read the CodeMirror Css file 
  var codeMirrorCss = fs.readFileSync('codemirror/lib/codemirror.css','utf8' , (err) => {
    if (err){
      console.log('Error with reading CodeMirror css file');
      return;
    }
  })
  // Add the font Size property to CODEMirror text
  codeMirrorCss += '.CodeMirror {font-size :  ' + fontSize + 'px  }'
 
  // Rewrite the CodeMirror Css
  console.log ('File Added: ' + codeMirrorCss);
  fs.writeFile('./codemirror/lib/codemirror.css', codeMirrorCss, (err) => {
    if (err) {
      console.log('Error with writing the CodeMirror css file')
    }
  })

  // Reload each tab so the new CSS takes a place
  tabGroup.eachTab((ctab, index, tabCollection) => {
    var webview = ctab.webview;
    webview.reload();
  })
})

ipcRenderer.on('resetfontsize', (e) => {

  // Get the param JSON File and parse it into **param variable
  var param = fs.readFileSync('./param.json', 'utf8', (err) => {})
  param = JSON.parse(param)

  fontSize = 12 ; //put the value 12 (reset the value) of the local variable

  param.fontsize = 12; // Reset the value (fontsize) of the param Data (JSON file)

  //Stringify and write the new params
  var param = JSON.stringify(param);
  fs.writeFile('./param.json', param, (err) => {})

  // Read the CodeMirror Css file 
  var codeMirrorCss = fs.readFileSync('codemirror/lib/codemirror.css','utf8' , (err) => {
    if (err){
      console.log('Error with reading CodeMirror css file');
      return;
    }
  })
  // Add the font Size property to CODEMirror text
  codeMirrorCss += '.CodeMirror {font-size :  ' + fontSize + 'px  }'
 
  // Rewrite the CodeMirror Css
  console.log ('File Added: ' + codeMirrorCss);
  fs.writeFile('./codemirror/lib/codemirror.css', codeMirrorCss, (err) => {
    if (err) {
      console.log('Error with writing the CodeMirror css file')
    }
  })

  // Reload each tab so the new CSS takes a place
  tabGroup.eachTab((ctab, index, tabCollection) => {
    var webview = ctab.webview;
    webview.reload();
  })
})


ipcRenderer.on('folder', (e)=> {
  
  var jsonFolder = fs.readFileSync('Files/folderOpen.json', 'utf8', (err) => {
  });

  var jsonFolderContent = JSON.parse(jsonFolder);
  refreshWhenFolderOpen();

})


tree.on('selected', item => {
  // treeClickEvent Function that Create and add Files to our project
  treeClickEvent(item);
})

let tab = tabGroup.addTab({
    title: 'Home',
    src: './homeEditor.html',
    webviewAttributes: {
        'nodeintegration': true
    },
    icon: 'fa fa-home',
    visible: true,
    active: true,

})

function openFile(item){
  data = item; // pass array [name, path] to data

  // Get the name of the file using regular expression and put it into **filename
  var filename = data[0].replace(/^.*[\\\/]/, '');
  // Get the extention of the file
  var exe = filename.split('.').pop();

  if (isOpen(data[0])) {
    return;
  }else {
  // Create the obj from File Class
  var file = new File(filename, data[0], data[1], exe, '12-12-2012');

  // Call the create File function
  file.createFile();

  //Push file into a list that hold all the opened files
  filesOpened.push(file);
  }
}

// Function to see if file is already open
function isOpen(filepath){
  var result;
  for (var i = 0; i < filesOpened.length; i++){
        if (filesOpened[i].filePath == filepath){
          return true;
        }else {
          result = false;
        }

  }
  return result;
}

function addTab(filename){

  let tab = tabGroup.addTab({
    title: filename,
    src: './Files/' + filename + '.html',
    webviewAttributes: {
        'nodeintegration': true
    },
    icon: 'fa fa-home',
    visible: true,
    active: true,})

}

function treeClickEvent(item) {

  if (item.type == 'file') {
    if (isOpen(item.path)){
      console.log('File Exists')
    }else {
      var dataOfNewFile = fs.readFileSync(item.path, 'utf8', (err)=> {
        console.log('can\'t read selected file') 
        return
      })
      var newItem = [item.path, dataOfNewFile];
      openFile(newItem);
    }
  }
}

function saveFile(){

   // Get the current tab
   let currentTab = tabGroup.getActiveTab();

   // Get the title of the time 
   var name = currentTab.getTitle();
 
   // Reading the JSON file of the tab selected and parse it into **jsonFileContent variable
   var jsonFile = fs.readFileSync('Files/' + name + '.json', 'utf8', (err)=> {
     if (err) {
       console.log('Error')
       return
      };
   });
   var jsonFileContent = JSON.parse(jsonFile);
   
   // Get the file content and path into **newSavedData and **pathOfFile
   var newSavedData = jsonFileContent.fileContent;
   var pathOfFile = jsonFileContent.filePath;
 
   // Write the new file
   fs.writeFile(pathOfFile, newSavedData, (err) => {
     if (err){
       console.log('Error with saving file')
       return
     }
   });

}
function refreshWhenFolderOpen(){
  
  window.$ = window.jQuery = require('./bower_components/jquery/dist/jquery.min.js');
  var root = {
    name: '',
    children: []
  }
  var tree = require('electron-tree-view')({
    root,
    container: document.querySelector('#jstree_demo_div'),
  })
  var root = JSON.parse(fs.readFileSync('./Files/folderOpen.json', 'utf8', (err) => {
     if (err) {
       console.log(err);
     }

   }));
 
 var tree = require('electron-tree-view')({
   root,
   container: document.querySelector('#jstree_demo_div'),
   children: c => c.children,
   label: c => c.name
 })
 tree.loop.update({ root })



 
}


// !!!!!!!! TREE REFRESH PROBLEM !!!!!!!!!!!