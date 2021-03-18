const models = require('../models/models');

const { consoleInfo, consoleError } = require('../utils/console');

const { getUserByUsername } = require('./user');

const deepinclude = [{ model: models.UserModel }, { model: models.VideoModel }];

exports.existDefaultList = async () => {
  try {
    const defaultList = await models.ListModel.findOne({
      where: { default: true }
    });
    return defaultList ? true : false;
  } catch (error) {
    consoleError(`existDefaultList -> ${error.message}`);
    throw new Error(error);
  }
};

exports.getAllLists = async () => {
  try {
    const lists = await models.ListModel.findAll({ include: deepinclude });
    return lists;
  } catch (error) {
    consoleError(`getAllLists -> ${error.message}`);
    throw new Error(error);
  }
};

exports.getListDefault = async () => {
  try {
    const defaultList = await models.ListModel.findOne({
      where: { default: true }
    });
    return defaultList;
  } catch (error) {
    consoleError(`getListDefault -> ${error.message}`);
    throw new Error(error);
  }
};

exports.getListById = async (id) => {
  try {
    const list = await models.ListModel.findOne({ where: { _id: id }, include: deepinclude });
    if (!list) throw new Error(`list not found...`);

    return list;
  } catch (error) {
    consoleError(`getList -> ${error.message}`);
    throw new Error(error);
  }
};

exports.getUserLists = async (username) => {
  try {
    const user = await getUserByUsername(username);
    return user.lists;
  } catch (error) {
    consoleError(`getUserLists -> ${error.message}`);
    throw new Error(error);
  }
};

exports.createList = async (name, description, isdefault) => {
  try {
    const list = {
      default: isdefault,
      name: name,
      description: description
    };

    const createdList = await models.ListModel.create(list);

    consoleInfo(`list created: ${name}`);

    return createdList;
  } catch (error) {
    consoleError(`createList -> ${error.message}`);
    throw new Error(error);
  }
};

exports.updateList = async (id, name, description) => {
  try {
    const list = await models.ListModel.findOne({ where: { _id: id } });
    if (!list) throw new Error(`list not found...`);

    list.name = name;
    list.description = description;

    await list.save();

    return list;
  } catch (error) {
    consoleError(`createList -> ${error.message}`);
    throw new Error(error);
  }
};

exports.disableList = async (id) => {
  try {
    const list = await models.ListModel.findOne({ where: { _id: id }, include: deepinclude });
    if (!list) throw new Error(`list not found...`);

    if (list.default) throw new Error(`can not disable default list...`);

    //clean all videos list
    for (let i = 0; i < list.videos.length; i++) {
      const video = list.videos[i];
      video.listId = null;
      await video.save();
    }

    await list.destroy();

    consoleInfo(`list ${list.name} has been disable...`);
    return list;
  } catch (error) {
    consoleError(`disableList -> ${error.message}`);
    throw new Error(error);
  }
};
