const express = require('express');
const router = express.Router();

const videoBLL = require('../logic/videoBLL');
const userBLL = require('../logic/userBLL');
const listBLL = require('../logic/listBLL');

//! endpoints users
router.post('/user/login', userBLL.login);
router.post('/user/create', userBLL.create);
router.post('/user/confirm', userBLL.confirm);
router.post('/user/password', userBLL.changePassword);
router.delete('/user/delete', userBLL.disable);
router.get('/users', userBLL.getUsers);
router.get('/user/', userBLL.getUserById);
router.put('/user/approvelist', userBLL.approveList);
router.put('/user/disapprovelist', userBLL.disapproveList);

//! endpoints lists
router.post('/list/create', listBLL.create);
router.delete('/list/delete', listBLL.disable);
router.get('/lists', listBLL.getAllLists);
router.get('/list/', listBLL.getListById);

//! endpoints videos
router.post('/video/add', videoBLL.addVideo);
router.get('/videos', videoBLL.getVideos);
router.get('/videos/unasigned', videoBLL.getUnasignedVideos);
router.get('/video/caption/', videoBLL.getVideoCaption);
router.get('/video/poster/:name', videoBLL.getVideoPoster);
router.get('/video/data/', videoBLL.getVideoData);
router.get('/video/:id', videoBLL.getVideo);
router.delete('/video/delete', videoBLL.disable);
router.put('/video/', videoBLL.updateListFromVideo);

module.exports = router;
