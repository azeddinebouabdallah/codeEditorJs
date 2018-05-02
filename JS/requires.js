const fs = require('fs')

var nameBeta = window.location.pathname; 
 nameBeta = nameBeta.replace(/^.*[\\\/]/, '');
 nameBeta = nameBeta.split('.')
 var name = ''

 for (var i = 0; i < nameBeta.length - 1; i++){
        name += nameBeta[i] + '.';
 }


editor.on('keyup', () => {
        
    if (fs.existsSync('Files/' + name + 'json')){

        var jsonFile = fs.readFileSync('Files/' + name + 'json', 'utf8', (err)=> {});
        var jsonFileContent = JSON.parse(jsonFile);
        jsonFileContent.isSaved = false;
        jsonFileContent.fileContent = editor.getValue();
        jsonFileContent = JSON.stringify(jsonFileContent, null, 2);

     }else {
        jsonFileContent = {
            fileContent : editor.getValue()
        }
        jsonFileContent = JSON.stringify(jsonFileContent, null , 2);
     }
    
     fs.writeFile('Files/' + name + 'json' , jsonFileContent, (err) => { 

     });
  });