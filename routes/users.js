var express = require('express');
var router = express.Router();
var passport = require('passport');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('./cors');
var User = require('../models/m_users');
var authentication = require('../authentication');
router.use(bodyParser.json());

const multer = require("multer");
const { verify } = require('jsonwebtoken');

const storage = multer.diskStorage(
  {
    destination: (req, file, callback) => {
      callback(null, 'public/uploads');
    },

    filename: (req, file, callback) => {
      callback(null, file.originalname)
    }
  }
);


const fileTypeValidation = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
    return callback(new Error("Check file extension!"));
  }
  callback(null, true);
}

const upload = multer({ storage: storage, fileFilter: fileTypeValidation });

router.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.statusCode = 200; })
  .get(cors.cors, function (req, res, next) {
    User.find({}).then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    }, (err) => next(err))
      .catch((err) => next(err))

  });

router.route('/signup')
  .options(cors.corsWithOptions, (req, res) => { res.statusCode = 200; })
  .post(cors.corsWithOptions, upload.single('photo'), (req, res, next) => {

    User.register(new User({ username: req.body.username }),
      req.body.password, (err, user) => {
        if (err) {

          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
        }
        else {
          if (req.body.firstname)
            user.firstname = req.body.firstname;
          if (req.body.lastname)
            user.lastname = req.body.lastname;
          if (req.file.filename) {
            user.photo = req.file.filename;
          }
          user.save((err, user) => {
            if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');

              res.json({ err: err });
              return;
            }
            passport.authenticate('local')(req, res, () => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({ success: true, status: 'Registration Successful!' });
            });
          });
        }
      });
  });
router.route('/login')
  .options(cors.corsWithOptions, (req, res) => { res.statusCode = 200; })
  .post(cors.corsWithOptions, passport.authenticate('local'), (req, res) => {

    var token = authentication.getToken({ _id: req.user._id });

    User.findOne({ _id: req.user._id  }, (err, user) => {

      if (err) {

        return res.json({ err: err });

      }
      else if (user) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          photo: `http://localhost:3001/uploads/${user.photo}`,
          success: true, token: token, status: 'You are successfully logged in!' 
        });

      }
    })

 
 
  });

router.route('/userprofile')
  .options(cors.corsWithOptions, (req, res) => { res.statusCode = 200; })
  .get(cors.cors, authentication.verifyUser, function (req, res, next) {

    User.findOne({ username: req.user.username }, (err, user) => {

      if (err) {

        return res.json({ err: err });

      }
      else if (user) {

        return res.json({
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          photo: `http://localhost:3001/uploads/${user.photo}`,
        });

      }
    })

  });


module.exports = router;
