// const sequelize_context = require('../models/sequelize').context;
const models = require('../models/models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { consoleInfo, consoleError } = require('../utils/console');

const token = require('../utils/token');
const { sendEmailValidateUser } = require('../utils/email');

const { getToken } = require('../utils/token');

const deepinclude = { model: models.ListModel, include: { model: models.VideoModel } };

const { getMessage } = require('../utils/language');

exports.existUserAdmin = async () => {
  try {
    const user = await models.UserModel.findOne({
      where: { admin: true }
    });
    return user ? true : false;
  } catch (error) {
    consoleError(`existUserAdmin -> ${error.message}`);
    throw new Error(error);
  }
};

exports.getUsers = async () => {
  try {
    const users = await models.UserModel.findAll({ include: deepinclude });
    return users;
  } catch (error) {
    consoleError(`getUsers -> ${error.message}`);
    throw new Error(error);
  }
};

exports.getUserByUsername = async (username) => {
  try {
    const user = await models.UserModel.findOne({ where: { username: username }, include: deepinclude });
    if (!user) throw new Error(getMessage('USERNOTFOUND', username));

    return user;
  } catch (error) {
    consoleError(`getUserByUsername -> ${error.message}`);
    throw new Error(error);
  }
};

exports.getUserById = async (id) => {
  try {
    const user = await models.UserModel.findOne({ where: { _id: id }, include: deepinclude });
    if (!user) throw new Error(getMessage('USERNOTFOUND', id));

    return user;
  } catch (error) {
    consoleError(`getUserById -> ${error.message}`);
    throw new Error(error);
  }
};

exports.createUser = async (username, password, admin, email) => {
  try {
    const hash_password = await bcrypt.hash(password, 8);

    const token = getToken();

    const confirmIfIsAdmin = admin;
    const user = {
      username: username,
      password: hash_password,
      admin: admin,
      email: email,
      confirmed: confirmIfIsAdmin,
      token: token
    };

    const createdUser = await models.UserModel.create(user);

    const list = await models.ListModel.findOne({ where: { default: true } });
    if (!list) throw new Error(`default list not found...`);

    await createdUser.addList(list, { through: { selfGranted: false } });
    await createdUser.save();

    consoleInfo(getMessage('USERCREATED', user.username));

    if (!admin) sendEmailValidateUser(username, email, token); //! el envio de correo se hace en background

    return createdUser;
  } catch (error) {
    consoleError(`createUser -> ${error.message}`);
    throw new Error(error);
  }
};

exports.confirmUser = async (token) => {
  try {
    const user = await models.UserModel.findOne({ where: { token: token } });
    if (!user) throw new Error(getMessage('USERNOTFOUND', token));

    user.confirmed = true;
    await user.save();

    consoleInfo(getMessage('USERCONFIRMED', user.username));

    return user;
  } catch (error) {
    consoleError(`createUser -> ${error.message}`);
    throw new Error(error);
  }
};

exports.changeUserPassword = async (id, oldPassword, newPassword) => {
  try {
    const user = await models.UserModel.findOne({ where: { _id: id } });
    if (!user) throw new Error(getMessage('USERNOTFOUND', id));

    const equals = await bcrypt.compare(oldPassword, user.password);
    if (!equals) throw new Error(getMessage('USERINCORRECTOLDPASSWORD', user.username));

    user.password = await bcrypt.hash(newPassword, 8);
    await user.save();

    consoleInfo(getMessage('USERCHANGEPASSWORD', user.username));

    return user;
  } catch (error) {
    consoleError(`changeUserPassword -> ${error.message}`);
    throw new Error(error);
  }
};

exports.approveList = async (id, listId) => {
  try {
    const user = await models.UserModel.findOne({ where: { _id: id } });
    if (!user) throw new Error(getMessage('USERNOTFOUND', id));

    const list = await models.ListModel.findOne({ where: { _id: listId } });
    if (!list) throw new Error(`list not found...`);

    await user.addList(list, { through: { selfGranted: false } });
    await user.save();

    return user;
  } catch (error) {
    consoleError(`approveList -> ${error.message}`);
    throw new Error(error);
  }
};

exports.disapproveList = async (id, listId) => {
  try {
    const user = await models.UserModel.findOne({ where: { _id: id } });
    if (!user) throw new Error(getMessage('USERNOTFOUND', id));

    const list = await models.ListModel.findOne({ where: { _id: listId } });
    if (!list) throw new Error(`list not found...`);

    await user.removeList(list, { through: { selfGranted: false } });
    await user.save();

    return user;
  } catch (error) {
    consoleError(`disapproveList -> ${error.message}`);
    throw new Error(error);
  }
};

exports.disableUser = async (id) => {
  try {
    const user = await models.UserModel.findOne({ where: { _id: id } });
    if (!user) throw new Error(getMessage('USERNOTFOUND', id));

    if (user.admin) throw new Error(`can not disable admin user...`);

    await user.destroy();
    if (!user) throw new Error();

    consoleInfo(getMessage('USERDISABLED', user.username));
    return user;
  } catch (error) {
    consoleError(`disableUser -> ${error.message}`);
    throw new Error(error);
  }
};

exports.loginUser = async (username, password) => {
  try {
    const user = await models.UserModel.findOne({ where: { [Op.or]: [{ username: username }, { email: username }] } });
    if (!user) throw new Error(getMessage('USERNOTFOUND', username));

    const equals = await bcrypt.compare(password, user.password);
    if (!equals) throw new Error(getMessage('USERINCORRECTPASSWORD', username));

    const newToken = token.getToken();
    const refreshToken = token.getRefreshToken();
    const confirmed = user.confirmed;
    const email = user.email;
    const admin = user.admin;

    const response = { id: user._id, password: user.password, newToken, refreshToken, confirmed, email, admin };

    consoleInfo(getMessage('USERLOGGEDIN', username));

    return response;
  } catch (error) {
    consoleError(`loginUser -> ${error.message}`);
    throw new Error(error);
  }
};
