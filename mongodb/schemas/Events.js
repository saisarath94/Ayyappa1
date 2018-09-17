var mongoose = require('../Connections').db
var Schema = mongoose.Schema;

var usersSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'UserProfile'
    },
    type:String,
    status:Number,
    likes:[{type:Number}],
}, { _id: false })


var eventSchema = Schema({


    userId: { type: Schema.Types.ObjectId, ref: 'UserProfile',autopopulate : true },
    eventTitle: String,
    eventDescription: String,
    eventDate : String,
    eventStartDateTime: Date,
    eventEndDateTime: Date,
    rsvpEndtimedate : Date,
    eventImageUrl: String,
    requireMembers:Number,
    eventLocation: String,
    addCalender : { type: Boolean, default: false },
    geo: {
    type: [Number],
    index: '2d'
  },
    createdDateTime: Date,
    modifiedDateTime: Date,

    users: [usersSchema],


}, { versionKey: false, collection: "Events" });

var eventsModel = mongoose.model('Events', eventSchema);
exports = module.exports = eventsModel;
// eventStatusId: Number,