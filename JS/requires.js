const fs = require('fs')

var name = window.location.pathname; 
var name = name.replace(/^.*[\\\/]/, '');

var textArea = document.getElementById('codemirror');
var editor = CodeMirror.fromTextArea(textArea, {
  lineNumbers: true,
  mode: "xml",
  htmlMode: true,
  theme: "material",
});

editor.on('change', () => {
     var dataReload = editor.getValue();
     if (fs.existsSync(name + '.json')){
     var fileContent = fs.readFileSync(name + '.json');
     var content = JSON.parse(fileContent);
     }else {
         var content = {
             fileContent : ''
         }
     }
     content.fileContent = editor.getValue();
     fs.writeFile(name, content, (err) => { });
  });