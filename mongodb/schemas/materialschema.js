var mongoose = require('../Connections').db
var Schema = mongoose.Schema;

var songsSchema = Schema({
    _id: Schema.Types.ObjectId,
    Thumbnail : String,
    SongUrl : String
})

var bhajanaSchema = Schema({
  
    _id: Schema.Types.ObjectId,
    Thumbnail : String,
    SongUrl : String
})

var slokasSchema = Schema({
  _id: Schema.Types.ObjectId,
   Thumbnail : String,
    SongUrl : String
 })

var videosSchema =  Schema({
  _id: Schema.Types.ObjectId,
  Thumbnail : String,
  VideoUrl : String
})

var StoriesSchema =  Schema({
  _id: Schema.Types.ObjectId,
  ImageUrl : String,
  Title : String,
  Story: String
})

var mediaSchema =  Schema({
	 _id: Schema.Types.ObjectId,
	songs : [songsSchema],
	bhajanaSongs:[bhajanaSchema],
	slokas : [slokasSchema],
  videos : [videosSchema],
  Stories : [StoriesSchema],
},{ versionKey: false, collection: "materials" })

var materialsModel = mongoose.model('mediaSchema', mediaSchema);
exports = module.exports = materialsModel;
// eventStatusId: Number,
