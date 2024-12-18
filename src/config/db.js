var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test-code');

mongoose.set('strictQuery', false);

mongoose.connection.on('connected', function () {  
  console.log('Connected to Mongo DB');
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});