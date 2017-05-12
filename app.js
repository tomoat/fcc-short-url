const express = require("express")
const path = require("path")
const mongoose = require("mongoose")

const app = express()
const port = process.env.PORT || 8080
const mongoURL = process.env.MONGOLAB_URL || 'mongodb://localhost:27017/url-short'

mongoose.connect(mongoURL);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
  }
);

const urlList = require('./schema.js')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'), err => {
        if (err) {
          console.log(err)
          res.status(err.status).end()
        } else {
          console.log('Send index.html')
        }
    })
})


// Lookup a shortened URL
app.get('/:id', function(req, res) {
  var id = parseInt(req.params.id,10);
  if(Number.isNaN(id)) {
    res.status(404).send("Invalid Short URL");
  } else {
    urlList.find({id: id}, function (err, docs) {
      if (err) res.status(404).send(err);
      if (docs && docs.length) {
        res.redirect(docs[0].url);
      } else {
        res.status(404).send("Invalid Short URL");
      }
    });
  }
});


// create a new shortened URL
app.get('/new/*?', (req,res) => {
  const validUrl = require('valid-url');
  const theUrl = req.params[0];

  // Validate the URL
  if(theUrl && validUrl.isUri(theUrl)) {
    // Search for URL first
    urlList.find({url: theUrl}, function (err, docs) {
      if(docs && docs.length) {
        res.status(201).json({
          "original_url": theUrl,
          "short_url": "http://fccp-short-url.herokuapp.com/" + docs[0].id
        });
      }
    });

    // If it's not found, create a new one
    urlList.create({url: theUrl}, function (err, myUrl) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(201).json({
        "original_url": theUrl,
        "short_url": "http://fccp-short-url.herokuapp.com/" + myUrl.id
      });
    });
  } else {
    res.status(400).json({
      error: "URL Invalid"
    });
  }

});

// Error Handler
function handleError(res, err) {
  return res.status(500).send(err);
}

app.listen(port, function(){
  console.log("Listening on port: " + port);
});