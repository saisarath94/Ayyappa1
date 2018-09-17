var express = require('express')
var mongoose = require('../mongodb/Connections')
var mongoose1 = require('mongoose')
var router = express.Router()
var logger = require('../logger')
var utils = require('../routes/Utils')
var userProfile = require('../mongodb/schemas/UserProfile')
var ObjectId = require('mongodb').ObjectID;

// http://localhost:8080/updateProfile
router.post('/', function (req, res, next) {
  var input = req.body
  //console.log(' ::: updateProfile ::: ' + 'userId : ' + input.userId + ' fullName : ' + input.fullName)
  console.log(req.body)
  var response = { statusCode: 1, statusMessage: "Success success" }
  userProfile.findOne( { mobileNumber: { $elemMatch: { number1:input.number1 }}}, function (err, user) {
    if (err) res.json({ statusCode: 0, statusMessage: "Error" })
    else if (!user) {
      console.log('No User found'); res.json({ statusCode: 0, statusMessage: "No User found" })
    } else if (user) {
      user.userId = input.userId,
        user.fullName = input.fullName,
        user.mobileNumber = input.mobilenumber,
        user.aboutYou = input.aboutYou,
        user.location = input.location,
        user.profileImage = input.profileImage,
        user.modifiedDateTime = utils.dateInUTC()
      saveUser(user, res)
    }
  })
})

var saveUser = function (user, res) {
  user.save(function (err, doc) {
    if (err) {
      res.json({ statusCode: 0, statusMessage: "something went wrong" })
    }
    var tempUserProfile = user.toObject()
    tempUserProfile.userId = doc._id
    delete tempUserProfile._id

    res.json({ statusCode: 1, statusMessage: 'Updated user', data: tempUserProfile })
  })
}

module.exports = router;


