# IA03 - Blog

In this activity we will be learning about the Express server as a backend. ExpressJS runs on Node and allows you to create complete backends and APIs.

We will be creating a backend API for a blog.

### Check point #1 - Start Project

run `npm install`

The run the following commands next
```
cd server
npm install
npm i --save parse dotenv cors
```

Add the following to the top of `bin\www`
```
require("dotenv").config();
```




### Check point #2 - Database

For this this assignment we will be creating a NoSQL database using [Parse](https://docs.parseplatform.org/js/guide/#relational-queries). To create our Parse server we will be using the BaaS [Back4App](https://back4app.com).

1. Create a new account.
1. Add an application
    1. Name your application "My Blog"

**Data Model**

*User*

|field|type|required|
|---|---|---|
|firstName|String|true|
|lastName|String|true|
|profileImage|File|false|

*Post*

|field|type|required|default|
|---|---|---|---|
|conents|String|true||
|likes|Numeber|true|0|
|tags|Array|false|[]|
|showComments|Boolean|false|false|
|title|String|true||
|user|Pointer|true||


*Comment*

|field|type|required|default|
|---|---|---|---|
|content|String|true||
|likes|Numeber|true|0|
|user|Pointer|true||
|post|Pointer|true||


Next locate your API keys under App Settings. You will need:
- Application ID
- JavaScript key

The Server URL is `https://parseapi.back4app.com`

Create a `.env` file within the server folder.


### Check point #3 - Creating Data end points

On our Express server we will create several data end points to retrieve information about the blog.
Under `server/routes` create a file `post.js`

In this file we will add:

```js
require("dotenv").config();
const Parse = require('parse/node');

//javascriptKey is required only if you have it on server.
Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JS_KEY);
Parse.serverURL = process.env.PARSE_SERVER_URL;
```


**GET /post/:user/all**

```js
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
})
```

**GET /post/:id**
```
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
```

**POST /post/add**
```js
app.post("/add", async (req, res) =>{
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

```

In the index.js filed add the following

**POST /login**
```js
app.post("/login", async (req, res) =>{

    const username = req.body.username;
    const password = req.body.password;

     await Parse.User.logIn(username, password).then(
         (user) => {
             res.status(200).json(user)
         }
     ).catch(err => {
         res.status(400).json({message: "ERROR: Log In failure.", err});
     })

});
```

**POST /logout**
```js
app.post("/logout", async (req, res) =>{

 
     await Parse.User.logOut().then(
         () => {
             res.status(200).json("Logged out")
         }
     ).catch(err => {
         res.status(400).json({message: "ERROR: Log In failure.", err});
     })

});
```

