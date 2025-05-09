const mongoose = require('mongoose');
require('dotenv').config();

const dbconnection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);

        console.log('DB connection successful');
    } catch (error) {
        console.error('DB connection issue:', error.message);
        process.exit(1);
    }
};

module.exports = dbconnection;
