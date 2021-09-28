var express = require('express');
var router = express.Router();
require("dotenv").config();
const Parse = require('parse/node');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.post("/login", async (req, res) =>{

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

router.post("/logout", async (req, res) =>{


    await Parse.User.logOut().then(
        () => {
            res.status(200).json("Logged out")
        }
    ).catch(err => {
        res.status(400).json({message: "ERROR: Log In failure.", err});
    })

});

module.exports = router;
