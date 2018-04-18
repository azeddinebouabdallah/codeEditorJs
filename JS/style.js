const TabGroup = require("electron-tabs");
const electron = require('electron')
const {ipcRenderer} = electron
const fs = require('fs')


let tabGroup = new TabGroup();
let data
let filePath

ipcRenderer.on('file', (e, item) => {
  data = item
  console.log(data)
  var filename = data[0].replace(/^.*[\\\/]/, '')
  code = JSON.stringify(data, null, 2)
  fs.writeFile('Files/'+ filename +'.json', code, (err) => {console.log(err)})

  newPage = '<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="utf-8"><title></title></head><body>' +
  '<p>' + data[1] + '</p></body></html>'

  fs.writeFile('Files/'+ filename, newPage, (err) => {
    console.log(err)
  })

  tab = tabGroup.addTab({
    title: filename,
    src: './Files/' + filename,
    webviewAttributes: {
        'nodeintegration': true
    },
    icon: 'fa fa-home',
    visible: true,
    active: true,
  })

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

});



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
