  
// var Mongoose = require('mongoose').Mongoose
// var random = require('mongoose-random');


// //Mongoose.Promise = global.Promise

// var env = require('../Environment');
// var MongoClient = require('mongodb').MongoClient;
// var db = new Mongoose()

// var pub;
// var environment = process.env.environment;
// var envVar = process.env.APP_ENVIRONMENT;

// if (!envVar)
//     pub = process.env.environment || 'none';
// else
//     pub = process.env.environment || envVar;
// console.log('database =', env[pub].databaseurl)

// db.connect(env[pub].databaseurl, { useMongoClient: true })
// //var db = Mongoose.connection
// var dbEvents = db.connection
// dbEvents.on('error', console.error.bind(console, 'Database Connection Error:'))
// dbEvents.once('open', function () {
//     console.log('Connected to the database successfully.');
//     console.log("***** CRUD  http://localhost:3000 ***** ")
// })

// exports = module.exports = {
//     db : db,
//     connection : dbEvents,
//     Mongoose: Mongoose
// }