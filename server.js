var mongoose = require("mongoose");
var express = require("express");

var axios = require("axios");
var cheerio = require("cheerio");

var PORT = 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

app.listen(PORT, function() {
	console.log("app running on port " + PORT);
});