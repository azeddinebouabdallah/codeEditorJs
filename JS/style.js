const TabGroup = require("electron-tabs");
const electron = require('electron')
const {ipcRenderer} = electron
const fs = require('fs')


let tabGroup = new TabGroup();
let filePath

let filesOpened = new Array();

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

    if (this.exe == 'html') {
      for (var i = 0; i<newData.length;i++){
        console.log(newData[i] + ' index : ' + i);
        if (i != newData.length - 1){
          var asciiDataI = newData[i].replace(/>/g, '&gt;').replace(/</g, '&lt;');
          newOrgData += asciiDataI + '\n';
          console.log('Cond 1');
        }
        else {
          asciiDataI = newData[i].replace(/>/g, '&gt;').replace(/</g, '&lt;');
          newOrgData += asciiDataI + '\n';
          console.log('Cond 2');
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
      '<textarea class="codemirror-textarea" id="codemirror">\n' +
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
      console.log(newData[i] + ' index : ' + i);
      if (i != newData.length - 1){
        newOrgData += newData[i] + '\n';
        console.log('Cond 1');
      }
      else {
          newOrgData += newData[i] + '\n';
          console.log('Cond 2');
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
    '<textarea class="codemirror-textarea" id="codemirror">\n' +
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
    for (var i = 0; i<newData.length;i++){
      console.log(newData[i] + ' index : ' + i);
      if (i != newData.length - 1){
        newOrgData += newData[i] + '\n';
        console.log('Cond 1');
      }
      else {
          newOrgData += newData[i] + '\n';
          console.log('Cond 2');
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
    '<textarea class="codemirror-textarea" id="codemirror">\n' +
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

  let tab = tabGroup.addTab({
  title: this.fileName,
  src: './Files/' + this.fileName + '.html',
  webviewAttributes: {
      'nodeintegration': true
  },
  icon: 'fa fa-home',
  visible: true,
  active: true,})
}

}

ipcRenderer.on('file', (e, item) => {

  data = item; // pass array [name, path] to data

  var filename = data[0].replace(/^.*[\\\/]/, '');
  var exe = filename.split('.').pop();

  var file = new File(filename, data[0], data[1], exe, '12-12-2012');

  file.createFile();
  filesOpened.push(file);
  
})

ipcRenderer.on('save', (e) => {
  let currentTab = tabGroup.getActiveTab();

  var name = currentTab.getTitle();

  var jsonFile = fs.readFileSync('Files/' + name + '.json', 'utf8', (err)=> {});
  var jsonFileContent = JSON.parse(jsonFile);
  
  var newSavedData = jsonFileContent.fileContent;
  var pathOfFile = jsonFileContent.filePath;

  fs.writeFile(pathOfFile, newSavedData, (err) => {
    if (err){
      console.log('Error with saving file')
      return
    }
  });
  

})

ipcRenderer.on('saveas', (e, filePath) => {

    var currentTab = tabGroup.getActiveTab();

    var name = currentTab.getTitle();
    
    var jsonFile = fs.readFileSync('Files/' + name + '.json', 'utf8', (err) => {});
    var jsonFileContent = JSON.parse(jsonFile);
    
    var newSavedData = jsonFileContent.fileContent
    var path = Buffer.from(filePath, 'utf8');
    console.log('Filename: ' + name + '\n Filepath : ' + path);
    fs.writeFile(path, newSavedData, (err) => {
      if (err) {
        console.log('Error with saving file as')
        return
      }
    })

    

})

ipcRenderer.on('closetab', (e) => {
  
    var activeTab = tabGroup.getActiveTab();
    console.log('Name of Tab: ' + activeTab.getTitle())
    activeTab.close(true);
})


let tab = tabGroup.addTab({
    title: 'Home',
    src: './Files/homeEditor.html',
    webviewAttributes: {
        'nodeintegration': true
    },
    icon: 'fa fa-home',
    visible: true,
    active: true,

})



require('./node_modules/jquery/dist/jquery.js')

TreeView = require('js-treeview')

tree = new TreeView([
    { name: 'Item 1', children: [] },
    { name: 'Item 2', expanded: true, children: [
            { name: 'Sub Item 1', children: [] },
            { name: 'Sub Item 2', children: [] }
        ]
    }
], 'treeview');

tree.on('collapse', function (e) {
    console.log(JSON.stringify(e));
});
