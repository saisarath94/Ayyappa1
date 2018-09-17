var express = require('express')
var mongoose = require('../mongodb/Connections')
var mongoose1 = require('mongoose')
var router = express.Router()
var utils = require('../routes/Utils')
var logger = require('../logger')
var ObjectId = require('mongodb').ObjectID;
var userProfile = require('../mongodb/schemas/UserProfile')
var groupsModel = require('../mongodb/schemas/Groups')
var eventsModel = require('../mongodb/schemas/Events')
// var groupNotifications = require('../mongodb/schemas/Notifications')


// router.get('/', function(req,res){
// groupsModel.find({},function(err,users){
//     .then(function(err,db){
//         if(err)
//              res.send(err)
//          else{
//             res.send(users)
//          }
//     })
// })
// })
// outer.get('/home',function(req,res){
//     var input=req.query;
// //     eventsModel.find({'geo': { $near: [ input.lat,input.lng],$maxDistance: 0.10}},function(err,events){
// //     if(err)
// //         res.send(err)
// // }).then(function(events){
//     groupsModel.find({'geo': { $near: [ 33.778175,76.5761714],$maxDistance: 0.10}}, function (err, groups) {
//          if (err) return res.status(500).send("There was a problem finding the groups.");
//          res.json({ statusCode: 200, statusMessage: 'Success!!!',groups,events})
//           });
// // })
// })

// router.get('/home',function(req,res){
//     var input=req.query;
//     eventsModel.find({},function(err,events){
//     if(err)
//         res.send(err)
// }).then(function(events){
//     groupsModel.find({},{"groupName":1}, function (err, groups) {
//          if (err) return res.status(500).send("There was a problem finding the groups.");
//          res.json({ statusCode: 200, statusMessage: 'Success!!!',groups,events})
//           });
// })
// })

router.get('/g', function (req, res) {
    var input= req.query;
    groupsModel.find({'geo': { $near: [ input.lat,input.lng],$maxDistance: 0.10}}, function (err, groups) {
        if (err) 
            res.send(err)
    }).then(function(groups){
             eventsModel.find({'geo': { $near: [ input.lat,input.lng],$maxDistance: 0.10}},function(err,events){
     if(err)
        res.send(err)
    else
         res.json({ statusCode: 200, statusMessage: 'Success!!!',groups,events})
            })
        })
    })
           

 



router.get('/', function (req, res) {
    var input = req.query;
    var response = { statusCode: 1 }
    validateRequest(input, response);
    if (response.statusCode != 0) {
        userProfile.findById({ _id: input.userId }, function (err, data) {
            if (err) {
                logger.debug('userProfileModel Error');
                logger.debug(err);
                res.json({ statussCode: 0, statusMessage: "ERROR" })
            } else if (!data) {
                logger.debug("InValid UserId");
                res.json({ statusCode: 0, statusMessage: "No User Found" })
            }
            else {
                groupsModel.find().populate({ path: 'userId' }).exec(function (err, groupdata) {
                    if (err) {
                        logger.debug('groupsModel Error');
                        logger.debug(err);
                        res.json({ statusCode: 0, statusMessage: "Error" })
                    } else if (!groupdata) {
                        logger.debug('eventsModel- No Events are not matched for this criteria')
                        res.json({ statusCode: 0, statusMessage: "No FanClubs are not matched for this criteria " })
                    } else {

                        var groupsArray = []
                        for (var i = 0; i < groupdata.length; i++) {
                            let groupObj = {}
                            let group = groupdata[i];
                            //eventObj = event.toObject();
                            groupObj = new Object()
                            groupObj.groupId = group._id
                            groupObj.groupName = group.groupName
                            groupObj.description = group.description
                            groupObj.groupImageUrl = group.groupImageUrl
                            groupObj.category = group.category
                            groupObj.hashTag = group.hashTag
                            groupObj.keywords = group.keywords
                            groupObj.createdDateTime = group.createdDateTime

                            groupObj.createdUserId = group.userId._id
                            groupObj.createdUserName = group.userId.fullName
                            groupObj.createdUserProfileImage = group.userId.profileImage
                            var membersCount = 0
                            for (let m = 0; m < group.users.length; m++) {
                                if (group.users[m].status === 2 || group.users[m].status === 1)
                                    membersCount++
                            }
                            groupObj.membersCount = membersCount

                            groupObj.joinStatus = 0
                            for (let j = 0; j < group.users.length; j++) {
                                if (input.userId === String(group.users[j].userId)) {
                                    groupObj.joinStatus = 1
                                }
                            }
                            // groupObj.memberCount = group.users.length;

                            groupsArray.push(groupObj);
                        }
                    }
                    res.json({ statusCode: 1, statusMessage: 'Success', data: groupsArray })
                })
            }

        })
    }
});

function validateRequest(input, response) {
    if (!utils.isValidObjectID(input.userId)) {
        response.statusCode = 0; response.statusMessage = "invalid userId"
    }
}


router.get('/groups', function (req, res) {
    groupsModel.find({category:'guruswamy'}, function (err, groups) {
        if (err) return res.status(500).send("There was a problem finding the groups.");
        res.status(200).send(groups);
    })
});

var Owner = 1; OwnerAdmin = 2; anyOne = 3
router.post('/', function (req, res) {
    var input = req.body;
    var response = { statusCode: 1, StatusMessage: "success" }
    if (input.groupId) {
        //Update
        groupValidation(input, response)
        if (response.statusCode != 0) {
            groupsModel.findById({ _id: input.userId, _id: input.groupId }, function (err, groupData) {
                if (err) {
                    res.json({ statusCode: 0, StatusMessage: Error })
                }
                else if (groupData) {
                    groupData.groupName = input.groupName
                    groupData.imageUrl = input.imageUrl
                    groupData.hashTag = input.hashTag
                    groupData.description = input.description
                    // groupData.inviteMember = input.inviteMember
                    // groupData.requestToJoin = input.requestToJoin
                    // for(var s=0;s<groupData.users.length;s++){
                    //     if(groupData.inviteMember === Owner && groupData.users[s].type == 'secondAdmin')
                    //     groupData.users[s].type = "user"
                    // }
                    groupData.modifiedDateTime = utils.dateInUTC()
                    groupData.populate({ path: 'userId', select: 'mobileNumber fullName', $ne: null }, function (err, gdata) {
                        if (gdata) {
                            gdata = gdata.toObject()
                            var gdataresponse = {}
                            gdataresponse.groupId = gdata._id
                            gdataresponse.groupName = gdata.groupName
                            gdataresponse.imageUrl = gdata.imageUrl
                            gdataresponse.hashTag = gdata.hashTag
                            gdataresponse.description = gdata.description
                            // gdataresponse.inviteMember = gdata.inviteMember
                            gdataresponse.createdUsermobileNumber = gdata.userId.mobileNumber
                            gdataresponse.createdUsername = gdata.userId.fullName
                            gdataresponse.createdDateTime = gdata.createdDateTime.toISOString().replace(/T/, ' ').replace(/\..+/, '')
                            gdataresponse.modifiedDateTime = gdata.modifiedDateTime.toISOString().replace(/T/, ' ').replace(/\..+/, '')
                            //gdataresponse.createdUserName = gdata.userId.fullName
                            //gdataresponse.createdUsermobileNumber = gdata.userId.mobileNumber
                            gdataresponse.createdUserInfo = gdata.userId.aboutYou
                            gdataresponse.createdUserImageUrl = gdata.userId.profileImage

                            if (input.userId === String(gdata.userId._id)) {
                                gdataresponse.isOwner = true
                                gdataresponse.status = 2
                            } else {
                                gdataresponse.isOwner = false
                                gdataresponse.status = 3
                            }

                            var membersCount = 0
                            for (var m = 0; m < gdata.users.length; m++) {
                                if (gdata.users[m].status === 2)
                                    membersCount++
                            }
                            gdataresponse.membersCount = membersCount

                            groupData.save((err, groupData) => {
                                if (err) {
                                    res.json({ statuscode: 0, statuscode: 'Error' })
                                }
                                res.json({ statusCode: 1, statusMessage: 'Updated', data: gdataresponse })
                            })
                        }
                    })
                }
                else {
                    res.json({ statusMessage: 'GroupData error' })
                }
            })

        } else {
            res.json(response)
        }

    } else {
        //create
        groupValidation(input, response)
        if (response.statusCode != 0) {
            userProfile.findById({ _id: input.userId }, function (err, data) {
                if (err) {
                    res.json({ statusCode: 0, StatusMessage: Error })
                } else {
                    var reasonId = '593500980b0cbbe593cd722c'
                    var groupDetails = new groupsModel({})
                    // groupDetails.groupId = groupDetails._id
                    groupDetails.groupName = input.groupName
                    groupDetails.groupImageUrl = input.groupImageUrl
                    groupDetails.groupIcon = input.groupIcon
                    groupDetails.category = input.category
                    groupDetails.hashTag = input.hashTag
                    groupDetails.keywords = input.keywords
                    groupDetails.description = input.description
                    // groupDetails.inviteMember = input.inviteMember
                    groupDetails.locationName = input.locationName
                    groupDetails.longitude = input.longitude
                    groupDetails.latitude = input.latitude
                    groupDetails.userId = input.userId
                    groupDetails.requestToJoin = input.requestToJoin
                    groupDetails.createdDateTime = utils.dateInUTC()

                    //    if(input.inviteMember == anyOne){
                    //        groupDetails.inviteMember = input.inviteMember

                    //    }else
                    //        if(input.inviteMember == Owner){
                    //            groupDetails.inviteMember = input.inviteMember
                    //    }
                    // //    else{
                    // //         groupDetails.inviteMember = input.inviteMember
                    //  //    }

                    // const index = input.phoneNumbers.indexOf(data.mobileNumber);
                    // if (index !== -1) {
                    //     input.phoneNumbers.splice(index, 1);
                    // }

                  
                    var tempUsers = []
                    var adminUser = {
                        userId: input.userId,
                        mobileNumber: data.mobileNumber,
                        fullName:data.fullName,
                        status: 2,
                        type: "admin",
                        createdDateTime: utils.dateInUTC(),
                        modifiedDateTime: utils.dateInUTC()
                    }
                    tempUsers.push(adminUser)
                    groupDetails.users = tempUsers



                    /*if (input.phoneNumbers && input.phoneNumbers.length) {
                        userProfile.find({ $or: [{ mobileNumber: { $in: input.phoneNumbers } }] }, function (err, userData) {
                            if (err) {
                                logger.debug('->userProfileModel Error'); logger.debug(err); res.json({ statussCode: 0, statusMessage: "Error" })
                            } else if (!userData) {
                                logger.debug('->userData - No Data');
                            } else {
                                var hasProfileUsers = []

                                for (u = 0; u < userData.length; u++) {
                                    var userInfo = userData[u]
                                    hasProfileUsers.push(userInfo.mobileNumber)
                                    var user = {
                                        userId: userInfo._id,
                                        mobileNumber: userInfo.mobileNumber,
                                        status: 1,
                                        type: "user",
                                        createdDateTime: utils.dateInUTC(),
                                        modifiedDateTime: utils.dateInUTC()
                                    }
                                    groupDetails.users.push(user)
                                }
                                var noProfileUsers = input.phoneNumbers.filter(function (val) {
                                    return hasProfileUsers.indexOf(val) == -1;
                                });
                                if (noProfileUsers.length) {
                                    for (np = 0; np < noProfileUsers.length; np++) {
                                        var noUserNumber = noProfileUsers[np]
                                        var user = {
                                            userId: ObjectId("000000000000000000000000"),
                                            mobileNumber: noUserNumber,
                                            status: 0,
                                            type: "user",
                                            createdDateTime: utils.dateInUTC(),
                                            modifiedDateTime: utils.dateInUTC()
                                        }
                                        groupDetails.users.push(user)
                                        var membersCount = 0
                                        for (var m = 0; m < groupDetails.users.length; m++) {
                                            if (groupDetails.users[m].status === 2)
                                                membersCount++
                                        }
                                        groupDetails.membersCount = membersCount

                                    }
                                }*/
                                saveGroup(groupDetails, input, req, res)
                            //}
                        //})
                    } /*else {
                        // no members added while fanclub creation 
                        saveGroup(groupDetails, input, req, res)
                    }
                }*/
            })
        } /*else {
            res.json(response)
        }*/

    }
})

function saveGroup(groupDetails, input, req, res) {
    groupDetails.save(function (err, fanCDetails) {
        if (err) {
            logger.debug('->fanCDetails save Error');
            logger.debug(err);
            res.json({ statussCode: 0, statusMessage: "Error" })
        }
        groupDetails
            .populate({
                path: 'userId',
                select: 'mobileNumber fullName aboutYou profileImage', $ne: null
            }, function (err, groupDetails) {
                if (err) {
                    logger.debug('->groupDetails populate Error');
                    logger.debug(err);
                    res.json({ statussCode: 0, statusMessage: "Error" })
                }
                //groupDetails = groupDetails.toObject()
                // groupDetails.createdUsername = groupDetails.userId.fullName
                //res.json({ statusCode: 1, statusMessage: 'Success', data: groupDetails })
                getCatgories(groupDetails, input, req, res)
            })
    })
}

function getCatgories(groupDetails, input, req, res) {
    groupDetails = groupDetails.toObject()
    var groupResponse = {}
    groupResponse.groupId = groupDetails._id
    groupResponse.groupName = groupDetails.groupName
    groupResponse.groupImageUrl = groupDetails.groupImageUrl
    groupResponse.groupIcon = groupDetails.groupIcon
    groupResponse.description = groupDetails.description
    groupResponse.category = groupDetails.category
    groupResponse.hashTag = groupDetails.hashTag
    groupResponse.keywords = groupDetails.keywords

    groupResponse.locationName = groupDetails.locationName
    groupResponse.latitude = groupDetails.latitude
    groupResponse.longitude = groupDetails.longitude

     groupResponse.createdDate = groupDetails.createdDate.toISOString().replace(/T/, ' ').replace(/\..+/, '')
     groupResponse.updatedDate = groupDetails.updatedDate.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    //groupResponse.publicOrPrivate = groupDetails.publicOrPrivate
    groupResponse.createdUserName = groupDetails.userId.fullName
    groupResponse.createdUserMobileNo = groupDetails.userId.mobileNumber
    groupResponse.createdUserInfo = groupDetails.userId.aboutYou
    groupResponse.createdUserImageUrl = groupDetails.userId.profileImage
    //if (!groupDetails.publicOrPrivate) {
    // groupResponse.requestToJoin = groupDetails.requestToJoin
    // if (!input.requestToJoin) {
    //     if (groupDetails.inviteMember == anyOne) {
    //         groupResponse.inviteMember = groupDetails.inviteMember
    //     }
    // } else {
    //     if (groupDetails.inviteMember == Owner) {
    //         groupResponse.inviteMember = groupDetails.inviteMember
    //     }
    // }

    var membersCount = 0
    for (var m = 0; m < groupDetails.users.length; m++) {
        if (groupDetails.users[m].status === 2)
            membersCount++
    }
    groupResponse.membersCount = membersCount
    var isOwner = false
    for (var i = 0; i < groupDetails.users.length; i++) {
        var id = groupDetails.users[i].userId
        if (req.body.userId == String(id)) {
            if (!isOwner) {
                groupResponse.isOwner = true
                isOwner = true
            }
        }
        /*else {
            if ('000000000000000000000000' != String(id)) {
                var groupNotifications = new FanclubNotifications({
                    senderUserId: ObjectId(req.body.userId),
                    receiverUserId: ObjectId(id),
                    groupId: groupDetails._id,
                    mType: ObjectId("59425bb60b0cbbe593cd8cd6"),
                    nType: ObjectId("59425dd60b0cbbe593cd8cd9"),
                    status: 1,
                    createdDateTime: utils.dateInUTC(),
                    sendDate: utils.dateInUTC()
                })
                groupNotifications.save(function (err, data) {
                    if (err) {
                        logger.debug('->groupNotifications save Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Error" })
                    } else {
                        logger.debug('->Create Group Notofication Saved')
                    }
                })
            }
        }*/
    }
    res.json({ statusCode: 1, statusMessage: 'Success', data: groupResponse })
}


function groupValidation(response, input, res, Owner) {
    if (response.statusCode != 0) {
        if (utils.isStringBlank(input.name)) {
            response.statusCode = 0; response.statusMessage = "GroupName is Mandatory"
        } else if (input.name.trim().length > 30) {
            response.statusCode = 0; response.statusMessage = "Name filed length should not be greater than 30"
        } else if (utils.isStringBlank(input.description)) {
            response.statusCode = 0; response.statusMessage = "Add Description"
        } else if (utils.isStringBlank(input.latitude)) {
            response.statusCode = 0; response.statusMessage = "latitude is Mandatory"
        } else if (utils.isStringBlank(input.locationName)) {
            response.statusCode = 0; response.statusMessage = "Location name is Mandatory"
        } else if (utils.isStringBlank(input.longitude)) {
            response.statusCode = 0; response.statusMessage = "longitude is Mandatory"
        } else if (input.description.length > 300) {
            response.statusCode = 0; response.statusMessage = "Description filed length should not be greater than 300";
        } else if (utils.isStringBlank(input.hashTag)) {
            response.statusCode = 0; response.statusMessage = "Give Hash Tag"
        } else if (utils.isStringBlank(input.imageUrl)) {
            response.statusCode = 0; response.statusMessage = "Add Image URL"
        } else if (!utils.isValidObjectID(input.userId)) {
            response.statusCode = 0; response.statusMessage = "InValid UserId"
        }
    }
}
module.exports = router
