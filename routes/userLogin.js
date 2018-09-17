var express = require('express');
var promise = require('promise')
var mongoose = require('../mongodb/Connections');
var router = express.Router();
var logger = require('../logger')
var utils = require('../routes/Utils')
var userProfile = require('../mongodb/schemas/UserProfile');
mongoose.promise = global.promise;

//http://localhost:8080/userLogin
router.post('/', function (req, res) {
    var input = req.body;
    console.log(input);
    var response = { statusCode: 1, statusMessage: "success" }
    userValidation(input, response)
    if (response.statusCode != 0) {
        userProfile.findOne({ mobileNumber: input.mobileNumber },{fullName : input.fullName},{profileImage:input.profileImage}, function (err, userprofile) {
            if (err) {
                return res.status(500).send("There was a problem adding the information to the database.");
            }
            else if (userprofile) {
                var tempProfile = userprofile.toObject()
                tempProfile.userId = userprofile._id
                tempProfile.fullName = tempProfile.fullName
                // delete tempProfile._id
                console.log('Already Registered User');
                res.json({ statusCode: 1, statusMessage: 'Already Registered User', data: tempProfile })
            }
             else {
                var userprofile1 = new userProfile({})
                userprofile1.mobileNumber = input.mobileNumber
                userprofile1.fullName = input.fullName
                userprofile1.aboutYou =""
                userprofile1.location = ""
                userprofile1.profileImage = input.profileImage
                userprofile1.createdDateTime = utils.dateInUTC()
                saveUser(userprofile1, res);
            }
        });
    }else{
        res.send(response)
    }
});

var saveUser = function (userprofile, res) {
    userprofile.save(function (err, userdata) {
        if (err) {
            logger.debug('userprofile save Error');
            res.json({ statusCode: 0, statusMessage: "something went wrong" })
        }
       var tempUserProfile = userprofile.toObject()
       tempUserProfile.userId = userdata._id
       delete tempUserProfile._id
        res.json({ statusCode: 1, statusMessage: 'New User', data: tempUserProfile })
    })
}
// // RETURNS ALL THE USERS IN THE DATABASE
router.get('/users', function (req, res) {
    userProfile.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});


// GETS A SINGLE USER FROM THE DATABASE
router.get('/users/:id', function (req, res) {
    userProfile.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});
// DELETES A USER FROM THE DATABASE
router.delete('/users/:id', function (req, res) {
    userProfile.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User " + user.name + " was deleted.");
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/users/:id', function (req, res) {
    userProfile.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

function userValidation(input, response) {
    if (utils.isStringBlank(input.mobileNumber)) {
        response.statusCode = 0; response.statusMessage = "mobileNumber is Mandatory"
    } else if (!utils.isMobileNumber(input.mobileNumber)) {
        response.statusCode = 0; response.statusMessage = "Provided phone number is invalid."
    }
}

module.exports = router;

// //http://localhost:3000/userLogin/users
// router.get('/users', function (req, res) {
//   new Promise(function (resolve, reject) {
//         userProfile.find({}).exec(function (err, users) {
//             if (err) {
//                 reject({ text: "Users list not found", error: findError });
//                 return;
//             } else {
//                 resolve(users);
//             }
//         });
//     }).then(function(users){
//         res.send(users)
//     }).catch(function(error){
//         res.send(error)
//     })
// });


// // RETURNS ALL THE USERS IN THE DATABASE
// router.get('/users', function (req, res) {
//     userProfile.find({}, function (err, users) {
//         if (err) return res.status(500).send("There was a problem finding the users.");
//         res.status(200).send(users);
//     });
// });

//http://blog.revathskumar.com/2015/07/using-promises-with-mongoosejs.html
// router.get('/users', function (req, res) {
//     new Promise(function (resolve, reject) {
//         userProfile.find({}).exec(function (err, users) {
//             if (err) {
//                 reject({ text: "Users list not found", error: findError });
//                 return;
//             } else {
//                 resolve(users);
//             }
//         });

//     })
// });