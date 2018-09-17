var mongoose = require('../Connections').db
var Schema = mongoose.Schema;
//const autopopulate = require('mongoose-autopopulate');
var usersSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'UserProfile'
    },
    // fullName:[ {
    //     type: Schema.Types.ObjectId,
    //     ref: 'UserProfile'
    // }],
    mobileNumber: String,
    fullName:String,
    type: String,
    status: Number,
}, { _id: false })



var groupSchema = Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    groupName: String,
    groupImageUrl: String,
    groupIcon: String,
    description: String,
    category: String,
    hashTag: String,
    keywords: String,
    latitude: String,
    longitude: String,
    locationName: String,
    createdDate: Date,
    updatedDate: Date,
    inviteMember: Number,
    geo: {
    type: [Number],
    index: '2d'
  },
    users: [usersSchema],

}, { versionKey: false, collection: 'Groups' })



var groupModel = mongoose.model('Groups', groupSchema);
exports = module.exports = groupModel;

//groupSchema.plugin(autopopulate)
//,autopopulate : true
