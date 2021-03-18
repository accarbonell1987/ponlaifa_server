const express = require('express');
const jwt = require('jsonwebtoken');

const { getKey } = require('../utils/token.js');

const { consoleError } = require('../utils/console');

const protectEndpoints = express.Router();

protectEndpoints.use((req, res, next) => {
  try {
    const accessToken = req.headers['access-token'];

    if (accessToken) {
      jwt.verify(accessToken, getKey(), (err, decoded) => {
        if (err) {
          return res.status(401).json({
            statusCode: 401,
            error: 'Unauthorized',
            message: err.message
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'token not exist'
      });
    }
  } catch (error) {
    consoleError(error);
  }
});
