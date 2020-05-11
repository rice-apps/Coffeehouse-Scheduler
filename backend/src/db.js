let mongoose = require("mongoose");
let { MONGODB_CONNECTION_STRING } = require("./config");
mongoose.Promise = require('bluebird');

const url = MONGODB_CONNECTION_STRING
  // "mongodb+srv://ultrascheduler:kAtwdqi3Ehd)H@cluster0-fy2jk.mongodb.net/ultrascheduler?retryWrites=true&w=majority";

  mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverSelectionTimeoutMS: 5000
  }).catch(err => console.log(err.reason));

mongoose.connection.on("connected", function() {
  	console.log("Mongoose connected to " + url);
});