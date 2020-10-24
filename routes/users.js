var express = require('express');
var router = express.Router();
var passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('./cors');
var User = require('../models/m_users');
var authentication = require('../authentication');
router.use(bodyParser.json());
/* GET users listing. */

router.get('/',authentication.verifyUser, function (req, res, next) {

   
  User.find({}).then((users) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  },(err) => next(err))
  .catch((err) => next(err))

});

router.post('/signup', (req, res, next) => {

  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});
router.post('/login', passport.authenticate('local'), (req, res) => {

  var token = authentication.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});


module.exports = router;
