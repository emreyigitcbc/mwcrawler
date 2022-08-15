const axios = require("axios")
const fs = require("fs")
const gifFrames = require("gif-frames");
module.exports = {
    async download(url, image_path) {
        let file = await axios({
            url,
            responseType: 'stream',
        })
        await file.data.pipe(fs.createWriteStream("./downloads/"+image_path))
    },
    async gifToPng(url) {
        let frames = await gifFrames({
            url,
            frames: 0,
            outputType: "PNG"
          })
        await frames.shift().getImage().pipe(fs.createWriteStream("./downloads/thumbnail.png"));
    },
    async sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
}