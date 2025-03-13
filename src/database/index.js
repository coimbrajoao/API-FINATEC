const Sequelize = require('sequelize');
const dbconfig = require('../config/database');

const User = require('../models/user');
const Category = require('../models/categories');

const database = new Sequelize(dbconfig);

User.init(database);
Category.init(database);

module.exports = database;