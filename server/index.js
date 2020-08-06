const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Zipper = require('./classes/Zipper');
const Downloader = require('./classes/DownloaderFacade');
const Crypto = require('./classes/Crypto');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const rootPath = path.dirname(require.main.filename);
const app = express();
const port = 4444 || process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.post('/video', async (req, res) => {
  try {
    Crypto.generateHash();
    const userChoices = req.body.userChoices;
    const DL = new Downloader(userChoices);
    const results = await DL.download();

    if (!results.length) {
      throw new Error('Aucun résultat');
    }

    res.append('Access-Control-Expose-Headers', 'Content-Disposition');

    if (results.length > 1) {
      const zipPath = `${rootPath}/zips/${Crypto.hash}.zip`;
      const isZipped = Zipper.zipFiles(zipPath)(results);
      if (!isZipped) throw new Error('La génération du zip a échouée');

      return res.download(zipPath, `${Crypto.hash}.zip`);
    } else {
      return res.download(results[0].path, results[0].filename);
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.listen(port, () => console.log(`listenning port ${port}`));
