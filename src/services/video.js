const models = require('../models/models');
const fs = require('fs');

const { consoleInfo, consoleError } = require('../utils/console');

const deepinclude = { model: models.ListModel };
const assetsPath = `src/assets`;

const { getListById } = require('./list');

exports.existDefaultVideos = async () => {
  try {
    const defaultsVideos = ['default_0', 'default_1'];

    const videos = await models.VideoModel.findAll({ include: deepinclude });

    const defaults = await Promise.all(videos.filter((p) => p.name === defaultsVideos[0] || p.name === defaultsVideos[1]));
    return defaults.length === 2 ? true : false;
  } catch (error) {
    consoleError(`getAllVideos -> ${error.message}`);
    throw new Error(error);
  }
};

exports.getAllVideos = async () => {
  try {
    const videos = await models.VideoModel.findAll({ include: deepinclude });
    return videos;
  } catch (error) {
    consoleError(`getAllVideos -> ${error.message}`);
    throw new Error(error);
  }
};

exports.getVideoById = async (id) => {
  try {
    const video = await models.VideoModel.findOne({ where: { _id: id }, include: deepinclude });
    if (!video) throw new Error(`video not found...`);

    return video;
  } catch (error) {
    consoleError(`getVideoById -> ${error.message}`);
    throw new Error(error);
  }
};

exports.getVideoByName = async (name) => {
  try {
    const video = await models.VideoModel.findOne({ where: { name: name }, include: deepinclude });
    if (!video) throw new Error(`video not found...`);

    return video;
  } catch (error) {
    consoleError(`getVideoByName -> ${error.message}`);
    throw new Error(error);
  }
};

exports.updateVideo = async (id, name, poster, duration, listId) => {
  try {
    const video = await models.VideoModel.VideoModel({ where: { _id: id } });
    if (!video) throw new Error(`video not found...`);

    video.name = name;
    video.poster = poster;
    video.duration = duration;
    video.listId = listId;

    await video.save();

    return video;
  } catch (error) {
    consoleError(`createList -> ${error.message}`);
    throw new Error(error);
  }
};

exports.updateListVideo = async (id, listId) => {
  try {
    const video = await models.VideoModel.findOne({ where: { _id: id } });
    if (!video) throw new Error(`video not found...`);

    video.listId = listId;

    await video.save();

    return video;
  } catch (error) {
    consoleError(`updateListVideo -> ${error.message}`);
    throw new Error(error);
  }
};

exports.createVideo = async (listId, name, duration, data) => {
  try {
    const list = await getListById(listId);

    const video = {
      name: name,
      poster: `video/${name}/poster`,
      duration: duration
    };

    if (data) {
      fs.writeFile(`${assetsPath}/${name}.mp4`, data, (err) => {
        if (err) throw new Error(`file has not been created...`);
        consoleInfo(`${name}.mp4 file saved...`);
      });
    }

    const createdVideo = await list.createVideo(video);
    return createdVideo;
  } catch (error) {
    consoleError(`createList -> ${error.message}`);
    throw new Error(error);
  }
};

exports.disableVideo = async (id) => {
  try {
    const video = await models.VideoModel.findOne({ where: { _id: id } });
    if (!video) throw new Error(`video not found...`);

    await video.destroy();

    consoleInfo(`video ${video.name} has been disable...`);
    return video;
  } catch (error) {
    consoleError(`disableVideo -> ${error.message}`);
    throw new Error(error);
  }
};
