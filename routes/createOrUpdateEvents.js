var express = require('express')
var mongoose = require('../mongodb/Connections')
var mongoose1 = require('mongoose')
var router = express.Router()
var logger = require('../logger')
var utils = require('../routes/Utils')
var ObjectId = require('mongodb').ObjectID;
var userProfile = require('../mongodb/schemas/UserProfile')
var eventsModel = require('../mongodb/schemas/Events')

router.get('/location',function(req,res){
    var input=req.query;
    eventsModel.find({'geo': { $near: [ input.lat,input.lng],$maxDistance: 0.10}},function(err,data){
    if(err)
        res.send(err)
    else
        res.send(data) 
})
})

//delete old data 
// router.get('/events2', function(req,res) {
//     var date = new Date();
//     eventsModel.find({eventEndDateTime : {$lt : date}},function(err,data){
//     if(err)
//         res.send(err)
//     else{
//         eventsModel.remove({'_id':{'$in':data}},function(err,result){
//             if(err)
//                 res.send(err)
//             else
//                 res.json(data)
//         })
       
//       }
// })
// })
//
//
router.get('/newevents', function (req, res) {
    var input = req.query;
    var response = { statusCode: 1 }
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
                var date = new Date();
                eventsModel.find({eventStartDateTime : {$lte : date}},function (err, eventdata) {
                    
                    if (err) {
                        logger.debug('eventsModel Error');
                        logger.debug(err);
                        res.json({ statusCode: 0, statusMessage: "Error" })
                    } else if (!eventdata) {
                        logger.debug('eventsModel- No Events are not matched for this criteria')
                        res.json({ statusCode: 0, statusMessage: "No FanClubs are not matched for this criteria " })
                    } else {
                                 eventsModel.remove({'_id':{'$in': eventdata}},function(err,result){
                                    if(err)
                                    res.send(err)
                                else{
                                   eventsModel.find({'geo': { $near: [ input.lat,input.lng],$maxDistance: 0.10}},function (err, eventdata) {
                    if (err) {
                        logger.debug('eventsModel Error');
                        logger.debug(err);
                        res.json({ statusCode: 0, statusMessage: "Error" })
                    } else if (!eventdata) {
                        logger.debug('eventsModel- No Events are not matched for this criteria')
                        res.json({ statusCode: 0, statusMessage: "No FanClubs are not matched for this criteria " })
                    } else {
                              
            
                        res.json({ statusCode: 1, statusMessage: 'Success', data: eventdata })
                    }
                    })
                }
            })
            }
        })
    }
})
})



router.get('/', function (req, res) {
    var input = req.query;
    var response = { statusCode: 1 }
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
                eventsModel.find({_id: input.eventId}).populate({ path: 'users.userId' }).exec(function (err, eventdata) {
                    if(eventdata.membersCount==input.membersCount)
                    if (err) {
                        logger.debug('eventsModel Error');
                        logger.debug(err);
                        res.json({ statusCode: 0, statusMessage: "Error" })
                    } else if (!eventdata) {
                        logger.debug('eventsModel- No Events are not matched for this criteria')
                        res.json({ statusCode: 0, statusMessage: "No FanClubs are not matched for this criteria " })
                    } else {

                        var eventsArray = []
                        for (var i = 0; i < eventdata.length; i++) {
                            let eventObj = {}
                            let event = eventdata[i];
                        
                            //eventObj = event.toObject();
                            eventObj = new Object()
                            eventObj.eventId = event._id
                            eventObj.eventTitle = event.eventTitle
                            eventObj.eventDescription = event.eventDescription
                            eventObj.eventImageUrl = event.eventImageUrl
                            eventObj.eventLocation = event.eventLocation
                            eventObj.geo = [event.latitude,event.longitude]
                            eventObj.requireMembers = event.requireMembers
                            eventObj.eventStartDateTime = event.eventStartDateTime
                            eventObj.createdDateTime = event.createdDateTime
                            eventObj.users = event.users
                            eventObj.createdUserId = event.userId._id
                            eventObj.createdUserName = event.userId.fullName
                            eventObj.createdUserProfileImage = event.userId.profileImage

                            eventsArray.push(eventObj);
                        }
                    }
                    res.json({ statusCode: 1, statusMessage: 'Success', data: eventsArray })
                })
            }
        })

})

function validateRequest(input, response) {
    if (!utils.isValidObjectID(input.userId)) {
        response.statusCode = 0; response.statusMessage = "invalid userId"
    }
}



var flag = false
router.post('/', function (req, res) {
    flag = false
    var input = req.body
    var response = { statusCode: 1, statusMessage: "Success" }
  if (input.eventId) {
        eventValidation(input, response)
        if (response.statusCode != 0) {

                eventsModel.findOneAndUpdate({ _id: input.eventId, userId: input.userId }, {
                    $set: {
                        eventDescription: input.eventDescription,
                        eventTitle: input.eventTitle,
                        eventEndDateTime: input.eventEndDateTime,
                        eventStartDateTime: input.eventStartDateTime,
                        eventLocation: input.eventLocation,
                        modifiedDateTime: utils.dateInUTC(),
                        eventImageUrl: input.eventImageUrl,
                        requireMembers:input.requireMembers,
                        eventLocation : input.eventLocation,
                        latitude: input.latitude,
                        longitude: input.longitude
                    }
                }, function (err, eventdata) {
                    if (err) {
                        logger.debug('->EventsModel Error'); logger.debug(err)
                        res.json({ statusCode: 0, statusMessage: "No eventId  are not matched for this criteria" })
                    } else if (eventdata) {
                         logger.debug('->Event updated')
                        res.json({ statusCode: 0, statusMessage: "Event updated" ,data:{eventdata}})
                    }
                    // })
                    else {
                        // logger.debug('->No userId and EventId are not matched for this criteria');
                        // res.json({ statusCode: 0, statusMessage: "No userId or EventId are not matched for this criteria " }); return
                        res.json(response)
                    }
                })

           // }
        }
        else{
            res.json(response)
        }
    }else {
            // logger.debug(' ::: createEvent ::: ')
            if (response.statusCode != 0) {
            userProfile.findById({ _id: input.userId }, function (err, data) {
                if (err) {
                    console.log('->UserProfileModel Error'); logger.debug(err)
                    res.json({ statussCode: 0, statusMessage: "Error" })
                 } 
                 else {   /*CreateEvent*/
                    
                        var reasonId = '593501b80b0cbbe593cd7235'/*Event creation*/
                        var createEvents = new eventsModel({})
                        createEvents.userId = input.userId
                        createEvents.eventTitle = input.eventTitle
                        createEvents.eventDescription = input.eventDescription
                        createEvents.eventDate = input.eventDate
                        createEvents.eventStartDateTime = input.eventStartDateTime
                        createEvents.eventEndDateTime = input.eventEndDateTime
                        createEvents.eventImageUrl = input.eventImageUrl
                        createEvents.requireMembers = input.requireMembers
                        createEvents.eventLocation = input.eventLocation
                        createEvents.rsvpEndtimedate=input.rsvpEndtimedate
                        createEvents.addCalender = input.addCalender
                        createEvents.geo=[input.latitude,input.longitude]
                        createEvents.createdDateTime = utils.dateInUTC()
                        createEvents.modifiedDateTime = utils.dateInUTC()
                         const index = input.phoneNumbers.indexOf(data.mobileNumber);
                         if (index !== -1) {
                         input.phoneNumbers.splice(index, 1);
                         }
                           
                       
                        var tempUsers = []
                        var adminUser = {
                        userId: input.userId,
                        mobileNumber: data.mobileNumber,
                        status: 4,
                        type: "admin",
                        createdDateTime: utils.dateInUTC(),
                        modifiedDateTime: utils.dateInUTC()
                    }
                    tempUsers.push(adminUser)
                    createEvents.users = tempUsers
               
                  if (input.phoneNumbers && input.phoneNumbers.length) {
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
                                        type: "user",
                                        status:0,
                                        createdDateTime: utils.dateInUTC(),
                                        modifiedDateTime: utils.dateInUTC()
                                    }
                                    createEvents.users.push(user)
                                }
                                var noProfileUsers = input.phoneNumbers.filter(function (val) {
                                    return hasProfileUsers.indexOf(val) == -1;
                                });
                                if (noProfileUsers.length) {
                                    for (np = 0; np < noProfileUsers.length; np++) {
                                        var noUserNumber = noProfileUsers[np]
                                        var user = {
                                            userId: ObjectId("000000000000000000000000"),
                                            type: "user",
                                            status:0,
                                            createdDateTime: utils.dateInUTC(),
                                            modifiedDateTime: utils.dateInUTC()
                                        }
                                        createEvents.users.push(user)
                                        var membersCount = 0
                                        for (var m = 0; m < createEvents.users.length; m++) {
                                            if (createEvents.users[m].status === 2)
                                                membersCount++
                                        }
                                        createEvents.users.membersCount = membersCount

                                    }
                                }
                                saveEvent(createEvents, input, req, res)
                            }
                        })
                    } 
                         else {
                        // no members added while fanclub creation 
                        saveEvent(createEvents, input, req, res)
                    }
                }
            })
        } else {
            res.json(response)
        }

    }
})

function saveEvent(createEvents, input, req, res) {
    createEvents.save(function (err, fanCDetails) {
        if (err) {
            logger.debug('->fanCDetails save Error');
            logger.debug(err);
            res.json({ statussCode: 0, statusMessage: "Error" })
        }
        createEvents
            .populate({
                path: 'userId',
                select: 'mobileNumber fullName profileImage', $ne: null
            }, function (err, createEvents) {
                if (err) {
                    logger.debug('->createEvents populate Error');
                    logger.debug(err);
                    res.json({ statussCode: 0, statusMessage: "Error" })
                }
                //groupDetails = groupDetails.toObject()
                // groupDetails.createdUsername = groupDetails.userId.fullName
                //res.json({ statusCode: 1, statusMessage: 'Success', data: groupDetails })
                getCatgories(createEvents, input, req, res)
            })
    })
}

function getCatgories(createEvents, input, req, res) {
    createEvents = createEvents.toObject()
    var eventResponse = {}
    eventResponse.userId = input.userId
                        eventResponse.eventTitle = createEvents.eventTitle
                        eventResponse.eventDescription = createEvents.eventDescription
                        eventResponse.eventDate = createEvents.eventDate
                        eventResponse.eventStartDateTime = createEvents.eventStartDateTime
                        eventResponse.eventEndDateTime = createEvents.eventEndDateTime
                        eventResponse.eventImageUrl = createEvents.eventImageUrl
                        eventResponse.eventLocation = createEvents.eventLocation
                        eventResponse.rsvpEndtimedate = createEvents.rsvpEndtimedate
                        // eventResponse.latitude = createEvents.latitude
                        // eventResponse.longitude = createEvents.longitude
                        eventResponse.addCalender = createEvents.addCalender
                        eventResponse.createdDateTime = utils.dateInUTC()
                        eventResponse.modifiedDateTime = utils.dateInUTC()
                        eventResponse.createdUserName = createEvents.userId.fullName
                        eventResponse.createdUserMobileNo = createEvents.userId.mobileNumber
                        eventResponse.createdUserInfo = createEvents.userId.aboutYou
                        eventResponse.createdUserImageUrl = createEvents.userId.profileImage
 
    var membersCount = 0
    for (var m = 0; m < createEvents.users.length; m++) {
        if (createEvents.users[m].status === 2)
            membersCount++
    }
    eventResponse.membersCount = membersCount
    var isOwner = false
    for (var i = 0; i < createEvents.users.length; i++) {
        var id = createEvents.users[i].userId
        if (req.body.userId == String(id)) {
            if (!isOwner) {
                eventResponse.isOwner = true
                isOwner = true
            }
        }
    }
    res.json({ statusCode: 1, statusMessage: 'Success', data: eventResponse })
}



    function eventValidation(input, response) {
        if (flag)
            if (!utils.isValidObjectID(input.eventId)) {
                response.statusCode = 0; response.statusMessage = "InValid eventId"
            }
        if (!utils.validateDate(input.eventStartDateTime) || !utils.validateDate(input.eventEndDateTime)) {
            console.log("Date Format Error")
            response.statusCode = 0; response.statusMessage = "please provide valid date format(yyyy-mm-dd hh:mm:ss) "
        } else if (utils.compare(input.eventStartDateTime, utils.dateInUTC()) == -1) {
            response.statusCode = 0; response.statusMessage = "start date cannot be less than current date "
        } else if (utils.compare(input.eventEndDateTime, utils.dateInUTC()) == -1) {
            response.statusCode = 0; response.statusMessage = "end date cannot be less than current date "
        } else if (utils.compare(input.eventStartDateTime, input.eventEndDateTime) == 0) {
            response.statusCode = 0; response.statusMessage = "start date & end date cannot be same "
        } else if (utils.compare(input.eventEndDateTime, input.eventStartDateTime) == -1) {
            response.statusCode = 0; response.statusMessage = "end date time  cannot be less than start date "
        } else if (utils.isStringBlank(input.eventDescription)) {
            response.statusCode = 0; response.statusMessage = "Description is Mandatory and Description should be String"
        } else if (input.eventDescription.length > 75) {
            response.statusCode = 0; response.statusMessage = "description length is out of range"
        } else if (utils.isStringBlank(input.eventTitle)) {
            response.statusCode = 0; response.statusMessage = "eventTitle is Mandatory and eventTitle should be String"
        } else if (input.eventTitle.trim().length > 30) {
            response.statusCode = 0; response.statusMessage = "eventTitle filed length should not be greater than 30"
        } else if (utils.isStringBlank(input.eventImageUrl)) {
            response.statusCode = 0; response.statusMessage = "eventImageUrl  is Mandatory"
        } else if (utils.isStringBlank(input.eventLocation)) {
            response.statusCode = 0; response.statusMessage = "eventLocation  should be String"
        }
        else if (!utils.isValidObjectID(input.userId)) {
            response.statusCode = 0; response.statusMessage = "InValid UserId"
        }
    }
 
    module.exports = router






// var express = require('express')
// var mongoose = require('../mongodb/Connections')
// var mongoose1 = require('mongoose')
// var router = express.Router()
// var logger = require('../logger')
// var utils = require('../routes/Utils')
// var ObjectId = require('mongodb').ObjectID;
// var userProfile = require('../mongodb/schemas/UserProfile')
// var eventsModel = require('../mongodb/schemas/Events')

// // router.get('/events', function (req, res) {
// //     eventsModel.find({}, function (err, users) {
// //         if (err) return res.status(500).send("There was a problem finding the users.");
// //         res.status(200).send(users);
// //     }).sort({ eventStartDateTime: 'desc' });
// // });

// //var flag = false
// router.post('/', function (req, res) {
//     //flag = false
//     var input = req.body
//     logger.debug(' ::: createOrUpdateEvent ::: ')
//     var response = { statusCode: 1, statusMessage: "Success" }
//         if (input.eventId) {
//         logger.debug(' ::: UpdateEvent ::: ')
//         /*UpdateEvent*/
//         //flag = true
//         //eventValidation(input, response)
//         if (response.statusCode != 0) {
//            // if (input.eventId) {
//                 // input.eventStartDateTime = input.eventStartDateTime.replace(" ", "T")
//                 // input.eventStartDateTime.concat('.000z')
//                 // input.eventEndDateTime = input.eventEndDateTime.replace(" ", "T")
//                 // input.eventEndDateTime.concat('.000z')

//                 eventsModel.findOneAndUpdate({ _id: input.eventId, userId: input.userId }, {
//                     $set: {
//                         eventDescription: input.eventDescription,
//                         eventTitle: input.eventTitle,
//                         eventEndDateTime: input.eventEndDateTime,
//                         eventStartDateTime: input.eventStartDateTime,
//                         eventLocation: input.eventLocation,
//                         modifiedDateTime: utils.dateInUTC(),
//                         eventImageUrl: input.eventImageUrl,
//                         eventLocation: input.eventLocation,
//                         latitude: input.latitude,
//                         longitude: input.longitude
//                     }
//                 }, function (err, eventdata) {
//                     if (err) {
//                         logger.debug('->EventsModel Error'); logger.debug(err)
//                         res.json({ statusCode: 0, statusMessage: "No eventId  are not matched for this criteria" })
//                     }
//                     // else if (eventdata) {
//                     //     logger.debug('->No Id are not matched for this criteria')
//                     //     res.json({ statusCode: 0, statusMessage: "Event has been updated successfully" ,data:response})
//                     // }
//                     else {
//                         res.json(response)
//                     }
//                 })

// //}
//         }
//         else{
//             res.json(response)
//         }
//     } else {
//         // logger.debug(' ::: createEvent ::: ')
//         userProfile.findById({ _id: input.userId }, function (err, data) {
//             if (err) {
//                 console.log('->UserProfileModel Error'); logger.debug(err)
//                 res.json({ statussCode: 0, statusMessage: "Error" })
//             } else if (!data) {
//                 console.log('->InValid UserId'); res.json({ statusCode: 0, statusMessage: "InValid UserId" })
//             } else { /*CreateEvent*/
//                 if (response.statusCode != 0) {
//                     var reasonId = '593501b80b0cbbe593cd7235'/*Event creation*/
//                     // input.eventStartDateTime = input.eventStartDateTime.replace(" ", "T")
//                     // input.eventStartDateTime.concat('.000z')
//                     // input.eventEndDateTime = input.eventEndDateTime.replace(" ", "T")
//                     // input.eventEndDateTime.concat('.000z')

//                     var createEvents = new eventsModel({})
//                     createEvents.userId = input.userId
//                     createEvents.eventTitle = input.eventTitle
//                     createEvents.eventDescription = input.eventDescription
//                     createEvents.eventDate = input.eventDate
//                     createEvents.eventStartDateTime = input.eventStartDateTime
//                     createEvents.eventEndDateTime = input.eventEndDateTime
//                     createEvents.eventImageUrl = input.eventImageUrl
//                     createEvents.eventLocation = input.eventLocation
//                     createEvents.latitude = input.latitude
//                     createEvents.longitude = input.longitude
//                     createEvents.addCalender = input.addCalender
//                     createEvents.createdDateTime = utils.dateInUTC()
//                     createEvents.modifiedDateTime = utils.dateInUTC()

//                     createEvents.save(function (err, data) {
//                         if (err) {
//                             console.log('->Events save Error');
//                             logger.debug(err)
//                             res.json({ statusCode: 0, statusMessage: "something went wrong" })
//                         }
//                         res.json({ statusCode: 1, statusMessage: ' Hurrah!! New Event Created' })
//                     })
//                 } else {
//                     res.json(response)
//                 }
//             }
//         })
//     }
// });


// function eventValidation(input, response) {
// //if (flag)
//         if (!utils.isValidObjectID(input.eventId)) {
//             response.statusCode = 0; response.statusMessage = "InValid eventId"
//         }
//     if (!utils.validateDate(input.eventStartDateTime) || !utils.validateDate(input.eventEndDateTime)) {
//         response.statusCode = 0; response.statusMessage = "please provide valid date format(yyyy-mm-dd hh:mm:ss) "
//     } else if (utils.compare(input.eventStartDateTime, utils.dateInUTC()) == -1) {
//         response.statusCode = 0; response.statusMessage = "start date cannot be less than current date "
//     } else if (utils.compare(input.eventEndDateTime, utils.dateInUTC()) == -1) {
//         response.statusCode = 0; response.statusMessage = "end date cannot be less than current date "
//     } else if (utils.compare(input.eventStartDateTime, input.eventEndDateTime) == 0) {
//         response.statusCode = 0; response.statusMessage = "start date & end date cannot be same "
//     } else if (utils.compare(input.eventEndDateTime, input.eventStartDateTime) == -1) {
//         response.statusCode = 0; response.statusMessage = "end date time  cannot be less than start date "
//     } else if (utils.isStringBlank(input.eventDescription)) {
//         response.statusCode = 0; response.statusMessage = "Description is Mandatory and Description should be String"
//     } else if (input.eventDescription.length > 75) {
//         response.statusCode = 0; response.statusMessage = "description length is out of range"
//     } else if (utils.isStringBlank(input.eventTitle)) {
//         response.statusCode = 0; response.statusMessage = "eventTitle is Mandatory and eventTitle should be String"
//     } else if (input.eventTitle.trim().length > 30) {
//         response.statusCode = 0; response.statusMessage = "eventTitle filed length should not be greater than 30"
//     } else if (utils.isStringBlank(input.eventImageUrl)) {
//         response.statusCode = 0; response.statusMessage = "eventImageUrl  is Mandatory"
//     } else if (utils.isStringBlank(input.eventLocation)) {
//         response.statusCode = 0; response.statusMessage = "eventLocation  should be String"
//     }
//     else if (!utils.isValidObjectID(input.userId)) {
//         response.statusCode = 0; response.statusMessage = "InValid UserId"
//     }
// }

// module.exports = router




    



