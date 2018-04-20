const TabGroup = require("electron-tabs");
const electron = require('electron')
const {ipcRenderer} = electron
const fs = require('fs')


let tabGroup = new TabGroup();
let data
let filePath

ipcRenderer.on('file', (e, item) => {

  console.log(item)
  data = item

  var filename = data[0].replace(/^.*[\\\/]/, '')
  var exe = filename.split('.').pop();
  code = JSON.stringify(data, null, 2)
  fs.writeFile('Files/'+ filename +'.json', code, (err) => {console.log(err)})
  switch (exe) {
    case 'html':
    newPage = '<!DOCTYPE html>'+
    '<html lang="en" dir="ltr">'+
      '<head>'+
        '<meta charset="utf-8">'+
        '<script src="../codemirror/lib/codemirror.js"></script>'+
        '<link rel="stylesheet" href="../codemirror/lib/codemirror.css">'+
        '<link rel="stylesheet" href="../codemirror/theme/material.css">'+
        '<script src="../codemirror/mode/htmlmixed/htmlmixed.js"></script>'+
        '<title></title>'+
      '</head>'+
      '<body>'+
        '<div id="codeeditor">'+
        '</div>'+
        '<script src="./JS/style.js" type="text/javascript"></script>'+
      '<script type="text/javascript">'+
        'var myCodeMirror = CodeMirror(document.getElementById(\'codeeditor\'), {'+
          'lineNumbers: true,'+
        '  mode: "htmlmixed",'+
          'theme: "material"'+
          'value: ' + data[1] +
        '})'+
      '</script>'+
      '</body>'+
    '</html>'

      break;
    case 'css':

     break;

    default:

  }
 //newPage = '<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="utf-8"><title></title></head><body>' +
//  '<textarea>'+ data[1] + '</textarea></body></html>'

  fs.writeFile('Files/'+ filename, newPage, (err) => {
    console.log(err)
  })

  let tab = tabGroup.addTab({
  title: filename,
  src: './Files/' + filename,
  webviewAttributes: {
      'nodeintegration': true
  },
  icon: 'fa fa-home',
  visible: true,
  active: true,})
  //p.value = item[1]

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
