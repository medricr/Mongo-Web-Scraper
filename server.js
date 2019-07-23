var mongoose = require("mongoose");
var express = require("express");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var db = require("./models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
// =======================================================
// ROUTES
// =======================================================
// app.get('/', function(req,res){
// 	res.render("index");
// })

app.get('/', function(req,res){ 

	// console.log("scrape fire");

	axios.get("https://pitchfork.com/").then(function(response){

		var $ = cheerio.load(response.data);

		var result = [];


		$(".album-review-hero").each(function(i,element) {
			
			var resultObject = {}

			// result.title = $(this).children("a").text();
			resultObject.title = $(element).find(".title ").text();
			resultObject.summary = $(element).find(".abstract").find("p").text();
			resultObject.url = $(element).find(".artwork").attr("href");

			// console.log(result);
			
			result.push(resultObject);

		// db.Article.create(result)
        // .then(function(dbArticle) {
        //   // View the added result in the console
        //   console.log(dbArticle);
        // })
        // .catch(function(err) {
        //   // If an error occurred, log it
        //   console.log(err);
        // });


		})

		// res.json(result);

		db.Article.insertMany(result).then(function(dbArticle) {
			res.json(dbArticle);
		}).catch(function(err){
			console.log(err);
		})
	})
})

app.listen(PORT, function() {
	console.log("app running on port " + PORT);
});