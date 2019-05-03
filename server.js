// BASE SETUP
// =============================================================================

// call the packages we need
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose   = require('mongoose');

const app = express(); //define our app usig express

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 8080; // set our port


//the following line is in case we want to work with localhost
//mongoose.connect(localhost:27017/userDB, {useNewUrlParser: true});

// connect to our database to MongoAtlas
mongoose.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true});


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

// middleware to use for all requests
//authentication and validation can happen here!
router.use(function(req, res, next) {
    // logging message
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

const Article = require('./app/models/article');


// on routes that end in /articles
// ----------------------------------------------------

router.route('/articles')
  // create an article (accessed at POST http://localhost:8080/api/articles)
  .post((req, res) => {
    // create a new instance of the Article model
    // and set its atributes (come from the request)
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    // save the article and check for errors
    newArticle.save((err) => {
      if(err)
        res.send(err);

        res.json({ message: 'Article created!' });
    });
  })

    // get all the articles (accessed at GET http://localhost:8080/api/articles)
    .get((req, res) => {
      //find all elements of the articles collection and the callback returns and array of matched elements
      Article.find((err, articles) => {
        if (err)
          res.send(err);

        res.json(articles);
      });
    });


// on routes that end in /articles/:articleName
// ----------------------------------------------------

router.route("/articles/:articleName")

  // get the article with articleName (accessed at GET http://localhost:8080/api/articles/:articleName)

  .get((req, res) => {
    //find the element in the articles collection and the callback returns the matched element
    Article.findOne({title: req.params.articleName}, (err, foundArticle) => {
        if (err)
          res.send(err);

        if (foundArticle)
          res.json(foundArticle);
        else
          res.json({message: "Article not found!"});

    });
  })


  // update the article with articleName (replace the whole object )
  //(accessed at PUT http://localhost:8080/api/articles/:articleName)

  .put((req, res) => {
    Article.findOneAndUpdate(
      {title: req.params.articleName},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},(err, result) => {
        if (err)
          res.send(err);

        if (result)
          res.json({message: "Succesfully updated!"});
        else
          res.json({message: "Article not found!"});

    });
  })

  // update the article with articleName (replace the fields needed )
  //(accessed at PATCH http://localhost:8080/api/articles/:articleName)

    .patch((req, res) => {
      Article.findOneAndUpdate({title: req.params.articleName},
        {$set: req.body},(err, result) => {
          if(err)
            res.send(err);

          if (result)
            res.json({message: "Succesfully updated!"});
          else
            res.json({message: "Article not found!"});
      });
    })


  // delete the article with articleName (accessed at DELETE http://localhost:8080/api/articles/:articleName)

    .delete((req, res) => {
      Article.deleteOne({title: req.params.articleName},(err, result) => {
          if(err)
            res.send(err);

          if (result.deletedCount > 0)
            res.json({message: "Succesfully deleted!"});
          else
            res.json({message: "Article not found!"});
        });
    });



// START THE SERVER
// =============================================================================
app.listen(port, function() {
  console.log('Magic happens on port ' + port);
});
