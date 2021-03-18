const jwt = require('jsonwebtoken');
const payload = { check: true };

const key = 'secure_ponlaifatube+1234567890';

exports.getKey = () => key;
exports.getToken = () => jwt.sign(payload, key, { expiresIn: 36000 });
exports.getRefreshToken = () => jwt.sign(payload, key, { expiresIn: 96000 });
