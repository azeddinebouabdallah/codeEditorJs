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

  var newData = data[1].split('\n');
  var newOrgData = ''
console.log('Length: ' +newData.length);
  for (var i = 0; i<newData.length;i++){
    console.log(newData[i] + ' index : ' + i);
    if (i != newData.length - 1){
      newOrgData += '\'' + newData[i] + '\\n \' +  \n';
      console.log('Cond 1');
    }
    else {
        newOrgData += '\'' + newData[i] + '\\n \' \n';
        console.log('Cond 2');
    }

}

    newPage = '<!DOCTYPE html>\n'+
    '<html lang="en" dir="ltr">\n'+
    '<head>\n'+
      '<meta charset="utf-8">\n'+
      '<script src="../codemirror/lib/codemirror.js"></script>\n'+
      '<link rel="stylesheet" href="../codemirror/lib/codemirror.css">\n'+
      '<link rel="stylesheet" href="../codemirror/theme/material.css">\n'+
      '<script src="../codemirror/mode/htmlmixed/htmlmixed.js"></script>\n'+
    '</head>\n'+
    '<body>\n'+
    '<h1>File Name</h1>\n'+
      '<div id="codeeditor">\n'+
      '</div>\n'+
      '<script src="../JS/style.js" type="text/javascript">\n'+
      '</script><script type="text/javascript">\n'+
      'var myCodeMirror =CodeMirror(document.getElementById("codeeditor"), {\n'+
         'lineNumbers: true,\n'+
         'mode: "htmlmixed",\n'+
         'theme: "material",\n'+
      '});\n'+
    ' myCodeMirror.getDoc().setValue('+
      newOrgData +
    ');\n' +
    '</script>\n'+
    '</body>\n'+
    '</html>'


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
    src: './Files/file3.html',
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
