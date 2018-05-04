class Folder {
    constructor(folderName, folderPath, subFiles){
        this.folderName = folderName;
        this.folderPath = folderPath;
        this.subFiles = subFiles;
    }

    createFolder(){
        const fs = require('fs')
        fs.writeFile(__dirname + '/folderOpen.json', this.subFiles, (err) => {
            if (err) {return}
        })
     }

    getFolderName(){
         return this.folderName;
      }

    getFolderPath(){
         return this.folderPath;
      }

    getSubFiles(){
        return this.subFiles;
     }
}
module.exports = Folder;