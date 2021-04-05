const models = require('../models/models');
const fs = require('fs');

const { consoleInfo, consoleError } = require('../utils/console');

const deepinclude = { model: models.ListModel };
const assetsPath = `src/assets`;

exports.existDefaultVideos = async () => {
  try {
    const defaultsVideos = ['default_0.mp4', 'default_1.mp4'];

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

exports.createVideo = async (name, file, isFromInit) => {
  try {
    console.log(name, file, isFromInit);

    const defaultList = await models.ListModel.findOne({
      where: { default: true }
    });

    const video = {
      name: name,
      poster: `video/${name}/poster`,
      duration: '',
      listId: defaultList._id
    };

    if (!isFromInit) {
      if (file) {
        // fs.writeFile(`${assetsPath}/${name}`, file, (err) => {
        //   if (err) throw new Error(`file has not been created...`);
        //   consoleInfo(`${name} file saved...`);
        // });

        file.mv(`${assetsPath}/${file.name}`, function (err) {
          if (err) throw new Error(`file has not been created...`);
          consoleInfo(`${name} file saved...`);
        });

        const createdVideo = await defaultList.createVideo(video);
        return createdVideo;
      } else throw new Error(`not file`);
    }
  } catch (error) {
    consoleError(`createVideo -> ${error.message}`);
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
