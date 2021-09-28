var express = require('express');
var router = express.Router();
require("dotenv").config();
const Parse = require('parse/node');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.get('/:user/post', async (req, res, next) => {
  const id = req.params.id;
  const Comment = Parse.Object.extend("Comment");
  const Post = Parse.Object.extend("Post");

  const innerQuery = new Parse.Query(Post);
  innerQuery.equalTo("objectId", id);
  innerQuery.include("user")

  const query = new Parse.Query(Comment);
  query.matchesQuery("post", innerQuery)
  query.include(["user", "post"])

  await query.find().then((comments) =>{
    res.status(200).json(comments);
  }).catch(err =>{
    res.status(400).json({message: "ERROR: Retrieving post failed.", err})
  })
});

module.exports = router;
