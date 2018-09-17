// /**
// * @author hmaram@GCS,nnalabelli
// */
// var express = require('express')
// var router = express.Router()
// var logger = require('../logger')
// var utils = require('../routes/Utils')
// var catUtils = require('../routes/CategoriesUtils')
// var cdata = catUtils.dbCategories
// var ObjectId = require('mongodb').ObjectID
// var fanclubMenuListModel = require('../mongodb/schemas/FanclubMenuList')
// var fanclubHomePageOrderModel = require('../mongodb/schemas/FanclubHomePageOrder')
// var fanClubsModel = require('../mongodb/schemas/FanClubs')
// var userProfileModel = require('../mongodb/schemas/UserProfile')
// var fanclubHomeSubCategoriesModel = require('../mongodb/schemas/FanclubHomeSubCategories')
// var Constants = require('../routes/Constants')


// router.get('/', function (req, res) {
//     var input = req.query
//     var fcHomeResponse = {}, fanClubsList = [], myFanClubsList = [], newFanClubsList = [], recommendedFanClubsList = [];
//     var commercialListOne = [], commercialListTwo = []
//     logger.debug(' ::: FanClub Home ::: ' + 'userId :' + input.userId)
//     var response = { statusCode: 1, statusMessage: "Success" }
//     fcHomeValidation(input, response)
//     if (response.statusCode) {
//         userProfileModel.findById({ _id: input.userId }, function (err, data) {
//             if (err) {
//                 logger.debug('userProfileModel- Error'); logger.debug(err); res.json({ statussCode: 0, statusMessage: "Error" })
//             } else if (!data) {
//                 logger.debug('InValid UserId'); res.json({ statusCode: 1, statusMessage: "InValid UserId" })
//             } else {
//                 /*======For all Db Categories data======*/
//                 var catSubCategoriesData = allCatSubCategoriesUser(cdata)
//                 fanclubMenuListModel.find({}, function (err, menuListDbData) {
//                     /*=======get Menu List Db Data======*/
//                            if (err) {
//                         logger.debug('menuListDbData Error'); logger.debug(err); res.json({ statussCode: 0, statusMessage: "Error" })
//                     } else {
//                         findCategories(input, fanClubsList).then(data => {
//                             Promise.all([myFanClubs(input), newFanClubs(input), recommendedFanClubs(input), commercialFK()])
//                                 .then(allResult => {
//                                     if (allResult[1] === 'No data Found') {
//                                         res.json({ statusCode: 1, statusMessage: "No data Found" })
//                                     } else {
//                                         responseData(input, allResult[0], myFanClubsList)
//                                         responseData(input, allResult[1], newFanClubsList)
//                                         responseData(input, allResult[2], recommendedFanClubsList)
//                                         if (allResult[3].length > 2) {
//                                             responseData(input, allResult[3].slice(0, 10), commercialListOne)
//                                         } else {
//                                             commercialListOne = allResult[3];
//                                             responseData(input, allResult[3].slice(0, 10), commercialListOne)
//                                         }
//                                         fanclubHomePageOrderModel.find({}).sort({ 'homePageOrder.order': -1 }).exec(function (err, homePData) {
//                                             if (err) {
//                                                 logger.debug('homePData Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: 'failure' })
//                                             } else {
//                                                 if (homePData) {
//                                                     var orderConfig = homePData[0].homePageOrder
//                                                     orderConfig.sort(function (a, b) {
//                                                         return parseFloat(a.order) - parseFloat(b.order)
//                                                     })
//                                                     var count = 0; order = 0
//                                                     for (var s = 0; s < orderConfig.length; s++) {
//                                                         if (orderConfig[s].name === 'categories') {
//                                                             if (fanClubsList.length) {
//                                                                 count++; order++
//                                                                 var fanClubs = {}
//                                                                 fanClubs.order = order
//                                                                 fanClubs.sectionName = "Be the greatest fan in the fanistan!"
//                                                                 fanClubs.fanClubs = fanClubsList
//                                                                 fcHomeResponse.fanClubs = fanClubs
//                                                             }
//                                                         }
//                                                         if (orderConfig[s].name === 'myFanClubs') {
//                                                             if (myFanClubsList.length) {
//                                                                 order++; count++
//                                                                 var myFanClubs = {}
//                                                                 myFanClubs.order = order
//                                                                 myFanClubs.sectionName = "My FanClubs"
//                                                                 myFanClubs.myFanClubs = myFanClubsList
//                                                                 fcHomeResponse.myFanClubs = myFanClubs
//                                                             }
//                                                         }
//                                                         /* Sending New Fc's */
//                                                         if (orderConfig[s].name === 'newfanclubs') {
//                                                             if (newFanClubsList.length) {
//                                                                 order++; count++
//                                                                 var pFanClubs = {}
//                                                                 pFanClubs.order = order
//                                                                 pFanClubs.sectionName = "New Fan Clubs"
//                                                                 pFanClubs.newFanClubs = newFanClubsList
//                                                                 fcHomeResponse.newFanClubs = pFanClubs
//                                                             }
//                                                         }
//                                                         if (orderConfig[s].name === 'rFanClubs') {
//                                                             if (recommendedFanClubsList.length) {
//                                                                 order++; count++
//                                                                 var rFanClubs = {}
//                                                                 rFanClubs.order = order
//                                                                 rFanClubs.sectionName = "Recommended Fan Clubs"
//                                                                 rFanClubs.rFanClubs = recommendedFanClubsList
//                                                                 fcHomeResponse.rFanClubs = rFanClubs
//                                                             }
//                                                         }
//                                                         if (orderConfig[s].name === 'commercialOne') {
//                                                             if (commercialListOne.length) {
//                                                                 order++; count++
//                                                                 var commercialOne = {}
//                                                                 commercialOne.order = order
//                                                                 commercialOne.sectionName = "Offical FanClubs"
//                                                                 commercialOne.commercialOne = commercialListOne
//                                                                 fcHomeResponse.commercialOne = commercialOne
//                                                             }
//                                                         }
//                                                         if (orderConfig[s].name === 'commercialTwo') {
//                                                             if (commercialListTwo.length) {
//                                                                 order++; count++
//                                                                 var commercialTwo = {}
//                                                                 commercialTwo.order = order
//                                                                 commercialTwo.sectionName = "Offical FanClubs"
//                                                                 commercialTwo.commercialTwo = commercialListTwo
//                                                                 fcHomeResponse.commercialTwo = commercialTwo
//                                                             }
//                                                         }
//                                                     }
//                                                     //Categories
//                                                     fcHomeResponse.categories = catSubCategoriesData
//                                                     //Menu List
//                                                     fcHomeResponse.menuList = []
//                                                     for (var m = 0; m < menuListDbData.length; m++) {
//                                                         var data = menuListDbData[m]
//                                                         data = data.toObject()
//                                                         data.id = data._id
//                                                         delete data._id
//                                                         fcHomeResponse.menuList.push(data)
//                                                     }
//                                                     fcHomeResponse.count = count
//                                                     res.json({ statusCode: 1, statusMessage: 'Success', data: fcHomeResponse })
//                                                 } else {
//                                                     res.json({ statusCode: 0, statusMessage: 'Failure' })
//                                                 }
//                                             }
//                                         })
//                                     }
//                                 }).catch(err =>{ console.log(err);res.json({ statussCode: 0, statusMessage: "Error" })})
//                         }).catch(err => res.json({ statussCode: 0, statusMessage: "Error" }));
//                     }
//                 })
//             }
//         })
//     } else {
//         res.json(response)
//     }
// })

// function findCategories(input, fanClubsList) {
//     let findCategoriesPromise = new Promise((resolve, reject) => {
//         fanclubHomeSubCategoriesModel.find({}).exec(function (err, hsData) {
//             if (err) {
//                 reject(err)
//             } else {
//                 for (var m = 0; m < hsData.length; m++) {
//                     var fcData = hsData[m]
//                     fcData = fcData.toObject()
//                     fcData.id = fcData._id
//                     delete fcData._id
//                     delete fcData.categoryId
//                     delete fcData.subCategoryId
//                     fanClubsList.push(fcData)
//                 }
//                 resolve(fanClubsList)
//             }
//         })
//     })
//     return findCategoriesPromise
// }

// function myFanClubs(input) {
//     /* Fc's which are Created by user, Joined by user */
//     var myFanClubsPromise = new Promise((resolve, reject) => {
//         fanClubsModel.find({ userId: input.userId,
//             $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).limit(parseInt(5)).sort({ createdDate: -1 }).skip(parseInt(0))
//             .populate({
//                 path: 'userId', select: 'mobileNumber fullName aboutYou profileImage'
//             }).exec(function (err, mData) {
//                 if (err) {
//                     reject(err)
//                 } else if (mData) {
//                     if (mData.length == 5) {
//                         resolve(mData)
//                     } else {
//                         var dL = mData.length
//                         var lmt = 5 - dL
//                         fanClubsModel.find({
//                             $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
//                             users: {
//                                 $elemMatch: {
//                                     "$or": [
//                                         {
//                                             "type": { "$eq": 'user' }
//                                         },
//                                         {
//                                             "type": { "$eq": 'secondAdmin' }
//                                         }], status: 2, userId: input.userId
//                                 }
//                             }
//                         })
//                             .limit(parseInt(lmt)).skip(parseInt(0)).sort({ 'users.updateddate': -1 })
//                             .populate({ path: 'userId', select: 'mobileNumber fullName aboutYou profileImage', $ne: null })
//                             .exec(function (err, jData) {
//                                 if (err) {
//                                     reject(err)
//                                 } else if (jData) {
//                                     var dt = []
//                                     dt = mData.concat(jData)
//                                     if (dt.length == 5) {
//                                         resolve(dt)
//                                     } else {
//                                         var dta = dt.length
//                                         var lmit = 5 - dta
//                                         fanClubsModel.find({ "favUsers.userId": input.userId ,
//                                         $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).limit(parseInt(lmit)).skip(parseInt(0))
//                                             .populate({ path: 'userId', select: 'mobileNumber fullName aboutYou profileImage' }).exec(function (err, favData) {
//                                                 if (err) {
//                                                     reject(err)
//                                                 } else if (favData) {
//                                                     var dtaa = []
//                                                     if (favData.length) {
//                                                         var dt2 = []
//                                                         for (var dt1 = 0; dt1 < dt.length; dt1++) {
//                                                             dt2 = dt[dt1]
//                                                             for (var j = 0; j < favData.length; j++) {
//                                                                 var fd = favData[j]
//                                                                 if (String(dt2._id) === String(fd._id)) {
//                                                                     favData.splice(j, 1)
//                                                                     dtaa = dt.concat(favData)
//                                                                 } else {
//                                                                     dtaa = dt.concat(favData)
//                                                                 }
//                                                             }
//                                                         }
//                                                         dtaa = dt.concat(favData)
//                                                     } else {
//                                                         dtaa = dt
//                                                     }
//                                                     resolve(dtaa)
//                                                 }
//                                             })
//                                     }
//                                 }
//                             })
//                     }
//                 }
//             })
//     })
//     return myFanClubsPromise
// }

// function newFanClubs(input) {
//     /* new Fc's where the member count gte 10 & updatedDate Sort */
//     let newFanClubsPromise = new Promise((resolve, reject) => {
//         fanClubsModel.aggregate([
//             {$match : {$or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]}},
//             { $unwind: "$users" },
//             { $match: { "users.status": 2 } },
//             { $group: { _id: "$_id", memberCount: { $sum: 1 } } },
//             { $match: { memberCount: { $gte: 10 } } },
//             { $skip: 0 }, { $limit: 6 }
//         ]).exec(function (err, fdata) {
//             if (err) {
//                 reject(err)
//             } else if (fdata) {
//                 var fIds = []
//                 for (var d = 0; d < fdata.length; d++) {
//                     var i = fdata[d]._id
//                     fIds.push(i)
//                 }
//                 fanClubsModel.find({ _id: { $in: fIds },
//                     $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).sort({ createdDate: -1 })
//                     .populate({ path: 'userId', select: 'mobileNumber fullName aboutYou profileImage', $ne: null })
//                     .exec(function (err, fffdata) {
//                         if (err) {
//                             reject(err)
//                         } else {
//                             resolve(fffdata)
//                         }
//                     })
//             }
//         })
//     })
//     return newFanClubsPromise
// }

// function recommendedFanClubs(input) {
//     let recommendedFanClubsPromise = new Promise((resolve, reject) => {
//         /*========retrieves the FanClubs based on Cat-Sub-Cat Selection of user=======*/
//         var subCatIds = []
//         userProfileModel.findById({ _id: input.userId }, function (err, data) {
//             /*=======get Users selected Cat-Sub-categorirs=======*/
//             if (err) {
//                 reject(err)
//             } else if (data.categories.length) {
//                 for (var i = 0; i < data.categories.length; i++) {
//                     for (var j = 0; j < data.categories[i].subCategories.length; j++) {
//                         subCatIds.push(data.categories[i].subCategories[j])
//                     }
//                 }
//                 fanClubsModel.find({ "catSubCategories.subCategories": { $in: subCatIds },
//                 $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).limit(6).skip(0)
//                     .populate({ path: 'userId', select: 'mobileNumber fullName aboutYou profileImage' }).exec(function (err, fdata) {
//                         if (err) {
//                             reject(err)
//                         } else if (fdata) {
//                             resolve(fdata)
//                         }
//                     })
//             } else {
//                 subCatIds = [ObjectId('100000000000000000000015'), ObjectId('100000000000000000000016'), ObjectId('100000000000000000000021')]
//                 fanClubsModel.find({ "catSubCategories.subCategories": { $in: subCatIds },
//                 $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).limit(6).skip(0)
//                     .populate({ path: 'userId', select: 'mobileNumber fullName aboutYou profileImage' }).exec(function (err, fdata) {
//                         if (err) {
//                             reject(err)
//                         } else if (fdata) {
//                             resolve(fdata)
//                         }
//                     })
//             }
//         })
//     })
//     return recommendedFanClubsPromise
// }

// function commercialFK() {
//     let commercialFKPromise = new Promise((resolve, reject) => {
//         fanClubsModel.find({ isCommercial: true,
//             $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).limit(6).sort({ createdDate: -1 }).skip(0)
//             .populate({ path: 'userId', select: 'mobileNumber fullName aboutYou profileImage' }).exec(function (err, mData) {
//                 if (err) {
//                     reject(err)
//                 } else if (mData) {
//                     resolve(mData)
//                 }
//             })
//     })
//     return commercialFKPromise
// }

// function responseData(input, fanclubs, list) {
//     var fanClubArray = []; fcmap = new Map(); keysArr = [];
//     for (var l = 0; l < fanclubs.length; l++) {
//         var catArray = []; fcObj = new Object(); membersCount = 0; fanClubObj = fanclubs[l]
//         fcObj.fanClubId = fanClubObj._id
//         fcObj.fanClubName = fanClubObj.name
//         fcObj.fanClubImageUrl = fanClubObj.imageUrl
//         fcObj.description = fanClubObj.description
//         fcObj.celebrityName = fanClubObj.celebrityName
//         fcObj.createdUserLoginType = Constants.MOBILE_LOGIN 
//         fcObj.createdUserMobileNo = ''
//         fcObj.createdUserFbId = ''
//         if (fanClubObj.userId) {
//             fcObj.createdUserName = fanClubObj.userId.fullName
//             fcObj.createdUserImageUrl = fanClubObj.userId.profileImage
//             fcObj.createdUserInfo = fanClubObj.userId.aboutYou
//             var loginType = fanClubObj.userId.loginType ? fanClubObj.userId.loginType : Constants.MOBILE_LOGIN;
//             fcObj.createdUserLoginType = loginType
//             fcObj.createdUserMobileNo = loginType === Constants.MOBILE_LOGIN ? fanClubObj.userId.mobileNumber : ''
//             fcObj.createdUserFbId = fanClubObj.userId.fbId ? fanClubObj.userId.fbId : "";
//         } else {
//             fcObj.createdUserName = ""
//             fcObj.createdUserImageUrl = ""
//             fcObj.createdUserMobileNo = ""
//             fcObj.createdUserInfo = ""
//         }
//         if (fanClubObj.fanClubIcon) {
//             fcObj.fanClubIcon = fanClubObj.fanClubIcon
//         }
//         fcObj.hashTag = fanClubObj.hashTag
//         fcObj.longitude = fanClubObj.longitude
//         fcObj.latitude = fanClubObj.latitude
//         fcObj.locationName = fanClubObj.locationName
//         fcObj.createdDate = fanClubObj.createdDate.toISOString().replace(/T/, ' ').replace(/\..+/, '')
//         fcObj.requestToJoin = fanClubObj.requestToJoin
//         fcObj.publicOrPrivate = fanClubObj.publicOrPrivate ? fanClubObj.publicOrPrivate : false
//         fcObj.inviteMember = fanClubObj.inviteMember ? fanClubObj.inviteMember : 1
//         if (input.userId === String(fanClubObj.userId._id)) {
//             fcObj.isOwner = true
//         } else {
//             fcObj.isOwner = false
//         }
//         for (var d = 0; d < fanClubObj.users.length; d++) {
//             if (input.userId === String(fanClubObj.users[d].userId) && fanClubObj.users[d].type === 'secondAdmin') {
//                 fcObj.isAdmin = true
//                 break
//             } else {
//                 fcObj.isAdmin = false
//             }
//         }
//         fcObj.favOrUnfav = 0
//         for (var q = 0; q < fanClubObj.favUsers.length; q++) {
//             if (String(fanClubObj.favUsers[q].userId) === input.userId) {
//                 fcObj.favOrUnfav = 1
//                 break
//             }
//         }
//         fcObj.status = 3
//         for (var n = 0; n < fanClubObj.users.length; n++) {
//             if (String(fanClubObj.users[n].userId) === input.userId) {
//                 fcObj.status = fanClubObj.users[n].status
//                 break
//             }
//         }
//         if (input.userId === String(fanClubObj.userId)) {
//             membersCount = fanClubObj.users.length
//         } else {
//             for (var m = 0; m < fanClubObj.users.length; m++) {
//                 if (fanClubObj.users[m].status === 2)
//                     membersCount++
//             }
//         }
//         fcObj.membersCount = membersCount
//         var subCategoryIds = fanClubObj.catSubCategories[0].subCategories
//         fcObj.catagories = catUtils.selectedCategories(subCategoryIds)
//         for (var i = 0; i < fcObj.catagories.length; i++) {
//             delete fcObj.catagories[i].isSelected
//             delete fcObj.catagories[i].imageUrl
//             for (var j = 0; j < fcObj.catagories[i].subCategories.length; j++) {
//                 delete fcObj.catagories[i].subCategories[j].isSelected
//             }
//         }
//         list.push(fcObj)
//     }
// }

// function allCatSubCategoriesUser(categories) {
//     var catSubCategories = []
//     if (categories) {
//         for (var i = 0; i < categories.length; i++) {
//             var categoriesObj = categories[i]; category = {}
//             category.categoryId = categoriesObj._id
//             category.categoryName = categoriesObj.name
//             category.imageUrl = categoriesObj.imageUrl
//             category.isSelected = 0
//             category.subCategories = []
//             if (categoriesObj.subCategories) {
//                 for (var j = 0; j < categoriesObj.subCategories.length; j++) {
//                     var subCategoriesObj = categoriesObj.subCategories[j]; subCategory = {}
//                     subCategory.isSelected = 0
//                     subCategory.subCategoryId = subCategoriesObj._id
//                     subCategory.subCategoryName = subCategoriesObj.name
//                     category.subCategories.push(subCategory)
//                 }
//             }
//             catSubCategories.push(category)
//         }
//     }
//     return catSubCategories
// }

// function fcHomeValidation(input, response) {
//     if (!utils.isValidObjectID(input.userId)) {
//         response.statusCode = 0; response.statusMessage = "userId is Mandatory"
//     }
// }

// exports = module.exports = router