const n = require('nonce')();
const crypto = require('crypto');

class Crypto {
  hash = null;

  generateHash() {
    this.hash = crypto
      .createHash('sha256')
      .update(n().toString())
      .digest('hex');
  }
}

module.exports = new Crypto();
