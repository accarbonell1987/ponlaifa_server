const { consoleInfo, consoleError } = require('./console');

const { existUserAdmin, createUser } = require('../services/user');
const { existDefaultVideos, createVideo } = require('../services/video');
const { existDefaultList, createList, getListDefault } = require('../services/list');

exports.loader = async () => {
  try {
    let initDefaultList = false;
    const existList = await existDefaultList();
    if (!existList) {
      await createList('default', 'default list for all users', true);
      consoleInfo(`Created default list...`);
      initDefaultList = true;
    }

    let initAdmin = false;
    const existAdmin = await existUserAdmin();
    if (!existAdmin) {
      const user = {
        username: 'administrator',
        password: 'ponlaifatube',
        admin: true,
        email: 'ponlaifawatube@ponlaifawa.net',
        confirmed: true
      };

      await createUser(user.username, user.password, user.admin, user.email, true);
      consoleInfo(`Created admin user...`);
      initAdmin = true;
    }

    let initDefaultVideos = false;
    const existVideos = await existDefaultVideos();
    if (!existVideos) {
      const defaultsVideos = ['default_0.mp4', 'default_1.mp4'];

      await createVideo(defaultsVideos[0], null, true);
      await createVideo(defaultsVideos[1], null, true);

      consoleInfo(`Created default videos...`);
      initDefaultVideos = true;
    }

    if (initAdmin || initDefaultList || initDefaultVideos) consoleInfo(`Intialize database...`);
  } catch (error) {
    consoleError(`loader -> ${error.message}`);
    throw new Error(error);
  }
};
