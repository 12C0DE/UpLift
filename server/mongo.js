const mongoose = require('mongoose');
// const env = require('../.env');

//override mongoose default Promise API
//replace with Global Promise API
mongoose.Promise = global.Promise;

const mongoUri = `mongodb://${process.env.AZURE_DB}:${process.env.AZURE_KEY}@${process.env
	.AZURE_DB}.mongo.cosmos.azure.com:${process.env
	.AZURE_PORT}/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@${process.env
	.AZURE_DB}@`;

function connect() {
	return mongoose.connect(mongoUri, { useMongoClient: true });
}

module.exports = {
	connect,
	mongoose
};
