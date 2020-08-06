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

    try {
      return await Promise.all(promises);
    } catch (error) {
      throw new Error(err);
    }
  }
}

module.exports = DownloaderFacade;
