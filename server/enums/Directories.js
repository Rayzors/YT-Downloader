const path = require('path');

const rootPath = path.dirname(require.main.filename);

const directories = {
  video: `${rootPath}/videos`,
  audio: `${rootPath}/audios`,
};

module.exports = directories;
