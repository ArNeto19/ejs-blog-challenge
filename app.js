//-- App Generals --//
//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');
mongoose.connect(`mongodb+srv://admin-${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.wx5ya.mongodb.net/blogDB`, {
  useNewUrlParser: true
});
//--

const postSchema = new mongoose.Schema({
  title: String,
  body: String
});
const NewPost = mongoose.model('newPost', postSchema);

//-- OBJECTS

const homeContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Tortor posuere ac ut consequat semper viverra nam libero.";

//--

//-- HOME PAGE
app.get('/', function(req, res) {

  NewPost.find({}, function(err, foundItems) {
    if (!err) {
      res.render('home', {
        homeContent: homeContent,
        posts: foundItems
      });
    }
  });

});
//--


//-- ABOUT PAGE
app.get('/about', function(req, res) {
  res.render('about', {
    aboutContent: aboutContent
  });
});
//--

//-- CONTACT PAGE
app.get('/contact', function(req, res) {
  res.render('contact', {
    contactContent: contactContent
  });
});
//--

//-- COMPOSE PAGE
app.get('/compose', function(req, res) {
  res.render('compose');
});

app.post('/compose', function(req, res) {

  let newPost = {
    title: req.body.postTitle,
    body: req.body.postText
  };
  let post = new NewPost({
    title: newPost.title,
    body: newPost.body
  });
  post.save();

  res.redirect('/');

});
//--

//-- POSTS PAGES
app.get('/post', function(req, res) {

  NewPost.find({}, function(err, foundItems) {
    if (!err) {
      if (foundItems.length === 0) {
        res.redirect('/compose');
      } else {
        res.render('post', {
          pageTitle: "Last post",
          title: foundItems[foundItems.length - 1].title,
          body: foundItems[foundItems.length - 1].body
        });
      }
    } else {
      console.log(err);
    }
    console.log(foundItems);
  });

});


app.get('/post/:postName', function(req, res) {

  NewPost.find({}, function(err, foundItems) {

    let newPostTitle = _.lowerCase(req.params.postName);

    if (!err) {
      foundItems.forEach(function(post) {

        let postTitle = _.lowerCase(post.title);

        if (postTitle === newPostTitle) {

          res.render('post', {
            pageTitle: "Post",
            title: post.title,
            body: post.body
          });
        }
      });
    } else {
      console.log(err);
    }
  });

});
//--

app.listen(process.env.PORT || 3000, function() {
  console.log('Server running smoothly');
});
