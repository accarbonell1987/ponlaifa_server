const userServices = require('../services/user');

const { consoleError, consoleInfo } = require('../utils/console');

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userServices.loginUser(username, password);

    return res.status(200).json({ statusCode: 200, response: user });
  } catch (error) {
    consoleError(`login => ${error.message}`);
    return res.json({ statusCode: 400, message: error.message });
  }
};

exports.create = async (req, res, next) => {
  try {
    const { username, password, admin, email } = req.body;
    const user = await userServices.createUser(username, password, admin, email);

    return res.status(200).json({ statusCode: 200, response: user });
  } catch (error) {
    consoleError(`createUser => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};

exports.confirm = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await userServices.confirmUser(token);

    return res.status(200).json({ statusCode: 200, response: user });
  } catch (error) {
    consoleError(`confirm => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};

exports.disable = async (req, res, next) => {
  try {
    const id = req.query.id;
    const user = await userServices.disableUser(id);

    return res.status(200).json({ statusCode: 200, response: user });
  } catch (error) {
    consoleError(`disableUser => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { id, oldPassword, newPassword } = req.body;
    const user = await userServices.changeUserPassword(id, oldPassword, newPassword);

    return res.status(200).json({ statusCode: 200, response: user });
  } catch (error) {
    consoleError(`confirm => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userServices.getUsers();
    return res.status(200).json({ statusCode: 200, response: users });
  } catch (error) {
    consoleError(`getUsers => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const id = req.query.id;
    const user = await userServices.getUserById(id);
    return res.status(200).json({ statusCode: 200, response: user });
  } catch (error) {
    consoleError(`getUserById => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};

exports.approveList = async (req, res) => {
  try {
    const id = req.query.id;
    const { listId } = req.body;

    const user = await userServices.approveList(id, listId);

    return res.status(200).json({ statusCode: 200, response: user });
  } catch (error) {
    consoleError(`approveList => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};

exports.disapproveList = async (req, res) => {
  try {
    const id = req.query.id;
    const { listId } = req.body;

    const user = await userServices.disapproveList(id, listId);

    return res.status(200).json({ statusCode: 200, response: user });
  } catch (error) {
    consoleError(`disapproveList => ${error.message}`);
    return res.status(200).json({ statusCode: 400, message: error.message });
  }
};
