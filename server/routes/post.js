var express = require('express');
var router = express.Router();
require("dotenv").config();
const Parse = require('parse/node');


//javascriptKey is required only if you have it on server.
Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JS_KEY);
Parse.serverURL = process.env.PARSE_SERVER_URL;

router.get("/:user/all", async (req, res, next) =>{
    const id = req.params.user;

    const Post = Parse.Object.extend("Post");
    const user = new Parse.User();
    user.id = id;
    const query = new Parse.Query(Post);
    query.equalTo("user", user);
    query.include("user");
    await query.find().then((posts) => {
            res.status(200).json({posts})
        }
    ).catch(err => {
        res.status(400).json({message: "ERROR: Retrieving posts failed.", err})
    })
});

/* GET users listing. */
router.get('/:id', async (req, res, next) => {
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

router.post("/add", async (req, res) =>{
    const Post = Parse.Object.extend("Post");
    const newPost = new Post();

    const user = new Parse.User();
    user.id = req.body.userId;

    newPost.set("title",req.body.title);
    newPost.set("content", req.body.content);
    newPost.set("likes", 0);
    newPost.set("tags", req.body.tags);
    newPost.set("showComments", req.body.showComments);
    newPost.set("user", user);

    newPost.save().then((post) => {
        res.status(200).json({postId: post.id});
    }).catch((err) => {
        res.status(400).json({message: "ERROR: New post creation failure.", err});
    })
});

module.exports = router;