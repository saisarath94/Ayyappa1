var express = require('express')
var mongoose = require('../mongodb/Connections')
var mongoose1 = require('mongoose')
var router = express.Router()
var logger = require('../logger')
var utils = require('../routes/Utils')
var ObjectId = require('mongodb').ObjectID;
var userProfile = require('../mongodb/schemas/UserProfile')
var eventsModel = require('../mongodb/schemas/gfeed')


router.get('/users', function (req, res) {
    var input= req.query;
  
    socialMediaFeedsModel.find({
        feedType:input.feedType,
        text:input.text,
        expiryDate: {
            $gt: new Date()
        },
       // locationTags: props.loginState,
        isDeleted: false,
    }).sort({
        createdDate: 1
    }).limit(parseInt(input.limit)).skip(0).exec(function (err, smfData)  {
        if (err){
        }else{
            
//   "feedId": "Unique DB Object",
//   "imageUrl": "imageURL if exist",
//   "videoUrl": "videoURL if exist",
//   "text": "feed text",
//   "type": "facebook/twitter/youtube/instagram",
//   "feedType": "image/video",
//   "ownerName": "Onwer Name if exist",
//   "ownerImageUrl": "Onwer ImageURL if exist",
//   "description": "description"
  var data=[]
  for (var i = 0; i < smfData.length; i++) {
   var smfData1 =smfData[i],tempfeedData={}
  tempfeedData.feedId=smfData1._id
  tempfeedData.imageUrl=smfData1.postedUrl
  tempfeedData.type=smfData1.feedType
  tempfeedData.ownerName=smfData1.celebrityName
  tempfeedData.ownerImageUrl=smfData1.feedProfileImage
  tempfeedData.text=smfData1.text
  tempfeedData.description=smfData1.description
  }
 // data.push(tempfeedData);
        res.json({ statusCode: 1, statusMessage: 'New User', data: tempfeedData});
        }
    })
})
module.exports = router;