var mongoose = require('../Connections').db
var Schema = mongoose.Schema;

var qSchema = Schema({
    // userId: { type: Schema.Types.ObjectId, ref: 'UserProfile',autopopulate : true },
    question:String,
    options: [String],   
});
var likeSchema = Schema({ 
  userId: { type: Schema.Types.ObjectId,ref: 'UserProfile' },
  questionId:String,
   })
var commentSchema=Schema({
  userId: { type: Schema.Types.ObjectId,ref: 'UserProfile' },
  createdDateTime:{type: Date, default: Date.now},
  questionId:String,
  comment:String,
})


var questionSchema = Schema({
    // userId: { type: Schema.Types.ObjectId, ref: 'UserProfile',autopopulate : true },
    title:String,
    description:String,
    imageurl:String,
    questions:[qSchema],
    likes:[likeSchema],
    comments:[commentSchema],

}, { versionKey: false, collection: "fun2win" });

var funModel = mongoose.model('fun2win', questionSchema);
exports = module.exports = funModel;