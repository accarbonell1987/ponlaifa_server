const listServices = require('../services/list');

const { consoleError, consoleInfo } = require('../utils/console');

exports.create = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const list = await listServices.createList(name, description, false);

    return res.status(200).json({ statusCode: 200, response: list });
  } catch (error) {
    consoleError(`createList => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};

exports.disable = async (req, res, next) => {
  try {
    const id = req.query.id;
    const list = await listServices.disableList(id);

    return res.status(200).json({ statusCode: 200, response: list });
  } catch (error) {
    consoleError(`disableList => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};

exports.getAllLists = async (req, res, next) => {
  try {
    const lists = await listServices.getAllLists();
    return res.status(200).json({ statusCode: 200, response: lists });
  } catch (error) {
    consoleError(`getUsers => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};

exports.getListById = async (req, res, next) => {
  try {
    const id = req.query.id;
    const list = await listServices.getListById(id);

    return res.status(200).json({ statusCode: 200, response: user });
  } catch (error) {
    consoleError(`getUserById => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};
