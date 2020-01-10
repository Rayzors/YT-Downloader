const zip = new require('node-zip')();

class Zipper {
  static zipFiles(path) {
    return function(filesArray) {
      try {
        const data = this.generateData(filesArray);
        fs.writeFileSync(path, data, 'binary');
        return true;
      } catch (error) {
        return false;
      }
    };
  }

  static generateData(filesArray) {
    const results = filesArray;
    results.forEach(({ filename, path }) => {
      zip.file(filename, fs.readFileSync(path));
    });
    return zip.generate({ base64: false, compression: 'DEFLATE' });
  }
}
