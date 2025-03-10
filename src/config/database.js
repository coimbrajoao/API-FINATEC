require('dotenv').config();

module.exports = {


    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME === 'test' ? process.env.DB_NAME + '_test' : process.env.DB_NAME,
    define: {
        timestamps: true,
        underscored: true
    }

}