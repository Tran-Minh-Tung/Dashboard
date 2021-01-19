"use strict";
exports.__esModule = true;
var dotenv = require("dotenv");
dotenv.config();
// environment
var NODE_ENV = process.env.NODE_ENV || 'development';
exports.NODE_ENV = NODE_ENV;
// author
var AUTHOR = process.env.AUTHOR || 'HCMUTE';
exports.AUTHOR = AUTHOR;
// couchdb
var COUCH_NAME = process.env.COUCH_NAME || 'xxx';
exports.COUCH_NAME = COUCH_NAME;
// console.log(APP_NAME)
// application
var NAME = process.env.NAME || 'travel';
exports.NAME = NAME;
var PRIMARY_COLOR = process.env.PRIMARY_COLOR || '#bae7ff';
exports.PRIMARY_COLOR = PRIMARY_COLOR;
var DOMAIN = process.env.DOMAIN || 'localhost';
exports.DOMAIN = DOMAIN;
var PORT = +process.env.PORT || 14047;
exports.PORT = PORT;
var END_POINT = process.env.END_POINT || "graphql" + NAME;
exports.END_POINT = END_POINT;
var VOYAGER = process.env.VOYAGER || 'voyager';
exports.VOYAGER = VOYAGER;
var FE_URL = process.env.FE_URL || 'xxx';
exports.FE_URL = FE_URL;
var RATE_LIMIT_MAX = +process.env.RATE_LIMIT_MAX || 10000;
exports.RATE_LIMIT_MAX = RATE_LIMIT_MAX;
var GRAPHQL_DEPTH_LIMIT = +process.env.GRAPHQL_DEPTH_LIMIT || 4;
exports.GRAPHQL_DEPTH_LIMIT = GRAPHQL_DEPTH_LIMIT;
// static
var STATIC = process.env.STATIC || 'static';
exports.STATIC = STATIC;
// mlab
// var MLAB_URL = process.env.MLAB_URL ||
//     'mongodb://admin:chnirt1803@ds119663.mlab.com:19663/chnirt-secret';
// exports.MLAB_URL = MLAB_URL;
// mongodb
var MONGO_PORT = +process.env.MONGO_PORT || 14049;
exports.MONGO_PORT = MONGO_PORT;
var MONGO_NAME = process.env.MONGO_NAME || NAME;
exports.MONGO_NAME = MONGO_NAME;
var MONGO_URL = "mongodb+srv://abcxyzdev:xdeSOYSbI36HbJ6O@cluster0-yslsh.mongodb.net/travel";
exports.MONGO_URL = MONGO_URL;
// jsonwebtoken
var ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'access-token';
exports.ACCESS_TOKEN = ACCESS_TOKEN;
var ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'abcxyz';
exports.ACCESS_TOKEN_SECRET = ACCESS_TOKEN_SECRET;
// bcrypt
var SALT = +process.env.SALT || 10;
exports.SALT = SALT;
// pubsub
var NOTIFICATION_SUBSCRIPTION = 'newNotification';
exports.NOTIFICATION_SUBSCRIPTION = NOTIFICATION_SUBSCRIPTION;
var USER_SUBSCRIPTION = 'newUser';
exports.USER_SUBSCRIPTION = USER_SUBSCRIPTION;
var MESSAGES_SUBSCRIPTION = 'newMessages';
exports.MESSAGES_SUBSCRIPTION = MESSAGES_SUBSCRIPTION;
