const Downloader = require('./Downloader');

/**
 *
 * @param {array} userChoices
 */

class DownloaderFacade {
  constructor(userChoices) {
    this.userChoices = userChoices;
  }

  async download() {
    const promises = this.userChoices.map(async (userChoice) => {
      return Downloader.download(userChoice);
    });

    return await Promise.all(promises);
  }
}

module.exports = DownloaderFacade;
