const fs = require('fs');
const thumbsupply = require('thumbsupply');

// const { videos } = require('../common/video');
const videoServices = require('../services/video');
const assetsPath = `src/assets`;

const { consoleError, consoleInfo } = require('../utils/console');

exports.getVideos = async (req, res) => {
  try {
    const videos = await videoServices.getAllVideos();
    return res.status(200).json({ statusCode: 200, response: videos });
  } catch (error) {
    consoleError(`getVideos => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};

exports.getUnasignedVideos = async (req, res) => {
  try {
    const videos = await videoServices.getAllVideos();
    const filterVideos = videos.filter((p) => p.list === null);

    return res.status(200).json({ statusCode: 200, response: filterVideos });
  } catch (error) {
    consoleError(`getVideos => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};

exports.updateListFromVideo = async (req, res) => {
  try {
    const id = req.query.id;
    const { listId } = req.body;

    const video = await videoServices.updateListVideo(id, listId);

    return res.status(200).json({ statusCode: 200, response: video });
  } catch (error) {
    consoleError(`getVideos => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};

exports.getVideoPoster = async (req, res) => {
  try {
    const id = req.params.id;
    const video = await videoServices.getVideoByName(id);
    const thumb = await thumbsupply.generateThumbnail(`./${assetsPath}/${video.name}.mp4`);

    return res.sendFile(thumb);
  } catch (error) {
    consoleError(`getVideoPoster => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};

exports.getVideo = async (req, res) => {
  try {
    const name = req.params.id;
    const video = await videoServices.getVideoByName(name);

    const path = `./src/assets/${video.name}.mp4`;

    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      consoleInfo('we have range', range);
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(path, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4'
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      consoleInfo('no range', range);
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      };
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
    return res;
  } catch (error) {
    consoleError(`getVideo => ${error.message}`);
    throw Error(error.message);
  }
};

exports.getVideoData = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const video = await videoServices.getVideoById(id);
    return res.json(video);
  } catch (error) {
    consoleError(`getVideoData => ${error.message}`);
    throw Error(error.message);
  }
};

exports.getVideoCaption = (req, res) => {
  try {
    return res.sendFile(`${assetsPath}/captions/sample.vtt`, { root: __dirname });
  } catch (error) {
    consoleError(`getVideoCaption => ${error.message}`);
    throw Error(error.message);
  }
};

exports.disable = async (req, res, next) => {
  try {
    const id = req.query.id;
    const list = await videoServices.disableVideo(id);

    return res.status(200).json({ statusCode: 200, response: list });
  } catch (error) {
    consoleError(`disableVideo => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};

exports.addVideo = async (req, res, next) => {
  try {
    const { name, data } = req.body;
    const correct = await videoServices.createVideo();

    return res.status(200).json({ statusCode: 200, response: user });
  } catch (error) {
    consoleError(`createUser => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};
