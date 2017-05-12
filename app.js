const express = require("express")
const path = require("path")
const mongodb = require("mongodb")
const validUrl = require('valid-url')

const app = express()
const port = process.env.PORT || 8080
const mongoURL = process.env.MONGOLAB_URL || 'mongodb://localhost:27017/url-short'

mongodb.MongoClient.connect(mongoURL, (err, db) => {
    if (err) {
        throw new Error('Database failed to connect!');
    } else {
        console.log('Successfully connected to MongoDB on port 27017.');
    }
    db.createCollection("sites", {
        capped: true,
        size: 5242880,
        max: 5000
    })
    
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
    app.get('/:url', (req, res) => {
        const url = process.env.APP_URL + req.params.url;
        if (url != process.env.APP_URL + 'favicon.ico') {
            // findURL(url, db, res);
            const sites = db.collection('sites');
            sites.findOne({
              "short_url": url
            }, function(err, result) {
              if (err) throw err;
             
              if (result) {
                
                console.log('Found ' + result)
                console.log('Redirecting to: ' + result.original_url)
                res.redirect(result.original_url)
              } else {
                res.send({
                    "error": "This url is not on the database."
                })
              }
            })
        }
    })
    
    app.get('/new/:url*', (req, res) => {
        const url = req.url.slice(5)
        console.log(url)
        let urlObj = {}
    
        if (validUrl.isUri(url)) {
          urlObj = {
            "original_url": url,
            "short_url": process.env.APP_URL + linkGen()
          };
          res.send(urlObj);
          save(urlObj, db);
        } else {
          urlObj = {
            "error": "Wrong url format, make sure you have a valid protocol and real site."
          };
          res.send(urlObj);
        }
    })
    
    function linkGen() {
        // Generates random four digit number for link
        var num = Math.floor(100000 + Math.random() * 900000);
        return num.toString().substring(0, 4);
    }
    
    function save(obj, db) {
        
        var sites = db.collection('sites');
        sites.save(obj, function(err, result) {
          if (err) throw err;
          console.log('Saved ' + result);
        });
    }
    
    app.listen(port, function(){
      console.log("Listening on port: " + port);
    });
})
