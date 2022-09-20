const mongoose = require('mongoose');

/** Connect to mongo database to manage data */
const connect = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGO_URI, {
            logger: process.env.NODE_ENV === 'development',
            serverSelectionTimeoutMS: 5000,
            dbName: 'production'
        });
        /** After connected to the database, Print a success message. */
        mongoose.connection.on('connected', () => {
            console.log(`Mongoose connected ===>: ${process.env.MONGO_URI}`);
            resolve();
        });
        mongoose.connection.on('error', (err) => {
            reject(err);
        });
    });
}

module.exports = connect;