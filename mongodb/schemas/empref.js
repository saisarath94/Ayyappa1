var mongoose = require('../Connections').db
var Schema = mongoose.Schema


var refSchema = new Schema({
deptno:Number,
deptname:String
}, { versionKey: false, collection: "department" })

var refModel = mongoose.model('department', refSchema)
exports = module.exports = refModel