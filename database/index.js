const Sequelize = require('sequelize');
const dbconfig = require('../config/database');

const User = require('../models/User');

const database = new Sequelize(dbconfig);

User.init(database);

module.exports = database;