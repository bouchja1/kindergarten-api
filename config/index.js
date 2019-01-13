require('dotenv').config()

module.exports = {
    db_host: process.env.DB_HOST,
    db_name: process.env.DB_NAME,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    PORT: 3001,
    SERVER_TIMEZONE: process.env.SERVER_TIMEZONE,
    API_KEY: process.env.API_KEY,
};