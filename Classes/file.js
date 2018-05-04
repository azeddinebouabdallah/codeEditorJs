
class File {

    constructor(fileName, filePath, content, exe, dateOfCreation){
    
      this.fileName = fileName;
      this.filePath = filePath;
      this.exe = exe;
      this.dateOfCreation = dateOfCreation;
      this.content = content;
      this.isSaved = true;
    
    }
    createFile() {
    
        var extention = this.exe;
        var dfc = this.dateOfCreation;
        console.log ('the file exe : ' + this.exe)
        var data = {
          fileName : this.fileName, 
          filePath : this.filePath,
          fileexe : this.exe,
          fileDate : this.dateOfCreation,
          fileContent : this.content,
          isSaved : this.isSaved
        }
        var JSONData = data;
        
        
        var code = JSON.stringify(JSONData, null, 2);
        fs.writeFile('./Files/'+ this.fileName +'.json', code, (err) => {console.log(err)})
        
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
    
      }else if (this.exe == 'js')
      {
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
          '<script src="../codemirror/mode/javascript/javascript.js"></script>\n'+
        '</head>\n'+
        '<body>\n'+
        '<textarea class="codemirror-textarea" id="codemirror" nodeintegration>\n' +
         newOrgData +
         '</textarea>\n'+
         '<script type="text/javascript">\n' +
         'var textArea = document.getElementById(\'codemirror\');\n' +
         'var editor = CodeMirror.fromTextArea(textArea, {\n' +
           'lineNumbers: true,\n' +
           'mode: "javascript",\n' +
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
      
      fs.writeFile('./Files/'+ this.fileName +'.html', newPage, (err) => {
        console.log(err)
      })
      
      this.showFile(this.fileName);
        }
    showFile(filename){

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

    saveFile(){
        var jsonFile = fs.readFileSync('./Files/' + this.fileName + '.json', 'utf8', (err)=> {
            if (err) {
              console.log('Error')
              return
             };
          });
          var jsonFileContent = JSON.parse(jsonFile);
          jsonFileContent.isSaved = true;
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
          this.isSaved = true;
          jsonFileContent = JSON.stringify(jsonFileContent, null, 2)
          fs.writeFile('./Files/' + this.fileName + '.json', jsonFileContent, (err) => {
            if (err){return}
          })
        }

   
        saveAs(path, newSavedData){

        fs.writeFile(path, newSavedData, (err) => {
            if (err) {
              console.log('Error with saving file as')
              return
            }
          })
     }
      
    
    getFileName(){
       return this.fileName;
      }
    getFilePath(){
      return this.filePath;
     }
    getFileContent(){
      return this.content;
     }
    getFileState(){
      return this.isSaved;
     }
    
    
    }

module.exports = File;