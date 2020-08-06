const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const toSnakeCase = require('lodash.snakecase');
const Formats = require('../enums/Formats');
const Directories = require('../enums/Directories');
const Crypto = require('./Crypto');

class Downloader {
  static getStream(url) {
    return ytdl(url);
  }

  static async getInfo(url) {
    try {
      const {
        player_response: { videoDetails },
      } = await ytdl.getInfo(url);

      return videoDetails || { title: 'no-title' };
    } catch (e) {
      throw new Error("Can't get info");
    }
  }

  static convertToFormat({ videoURL, type }) {
    return new Promise(async (resolve) => {
      const { title } = await this.getInfo(videoURL);
      const stream = this.getStream(videoURL);
      const filename = toSnakeCase(title);

      if (
        !type ||
        !Directories.hasOwnProperty(type) ||
        !Formats.hasOwnProperty(type)
      ) {
        throw new Error('Aucun type ou type inexistant');
      }

      const path = `${Directories[type]}/${filename}__${Crypto.hash}.${Formats[type]}`;
      const info = {
        path,
        title,
        filename: `${filename}.${Formats[type]}`,
        format: Formats[type],
      };

      if (fs.existsSync(path)) {
        return resolve(info);
      }

      return ffmpeg(stream)
        .on('end', () => resolve(info))
        .save(path);
    });
  }

  static checkYoutubeUrl(string) {
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?$/;
    return string.match(regex);
  }

  static download({ videoURL, type }) {
    try {
      if (!videoURL) throw new Error("Pas d'URL renseignée");
      if (!this.checkYoutubeUrl(videoURL))
        throw new Error("Ceci n'est pas une URL Youtube");
      if (!type) throw new Error('Pas de type renseigné');

      return this.convertToFormat({ videoURL, type });
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Downloader;
