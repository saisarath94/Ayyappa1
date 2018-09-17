var mongoose = require('../Connections').db
var Schema = mongoose.Schema

var feedsSchema = Schema({

}, { _id: false })

var smSchema = new Schema({
    categoryId: { type: Schema.Types.ObjectId },
    subCategoryId: { type: Schema.Types.ObjectId },
    celebrityName: String,
    //socialChannel: String,
    expiryDate: { type: Date },
    //location: { type: Array },
    locationTags: { type: Array },
    feedId: String,
    feedType: String,
    text: String,
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    imageUrl: String,
    sourceType: String,
    linkForVideo: String,
    feedDescription: String,
    feedUsername: String,
    feedProfileImage: String
}, { versionKey: false, collection: "gfeeds" })

var socialMediaFeedsModel = mongoose.model('gfeeds', smSchema)
exports = module.exports = socialMediaFeedsModel