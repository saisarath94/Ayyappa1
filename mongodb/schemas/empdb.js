var mongoose = require('../Connections').db
var Schema = mongoose.Schema



var empdbSchema = new Schema({
 empName:String,
 deptno:Number,
 empdesk:Number
//  emp :[refSchema] 
}, { versionKey: false, collection: "employee" })

var empdbModel = mongoose.model('employee', empdbSchema)
exports = module.exports = empdbModel