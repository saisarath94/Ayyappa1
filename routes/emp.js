var express = require('express')
var mongoose = require('../mongodb/Connections')
var mongoose1 = require('mongoose')
var router = express.Router()
var logger = require('../logger')
var utils = require('../routes/Utils')
var ObjectId = require('mongodb').ObjectID;
var userProfile = require('../mongodb/schemas/UserProfile')
var empdbModel = require('../mongodb/schemas/empdb')
var refModel = require('../mongodb/schemas/empref')



router.get('/', function (req, res) {
    var input= req.query;

    empdbModel.aggregate([   
     {   
    $lookup:
         {
            "from": "department",
            "localField" : "deptno",
            "foreignField" : "deptno",
            "as" : "emp_detials"
        }
    },
    { 
        "$match":{"emp_detials.deptname" :"development"}
        }
    ]).exec(function (err, smfData)  {
        if (err){
            logger.debug(err);
            console.log(err);
        }else{
            console.log(smfData);
            var data=[] 
            for (var i = 0; i < smfData.length; i++) {
             let smfData1 ={}
                smfData1.empId = smfData[i]._id || ""
                smfData1.empname =  smfData[i].empname || ""
                smfData1.deptno =  smfData[i].deptno || ""
                smfData1.empdesk =  smfData[i].empdesk || ""
                smfData1.deptname = smfData[i].emp_detials[0].deptname || ""
                delete smfData1._id
            data.push( smfData1);
           
            }
        res.json({ statusCode: 1, statusMessage: 'success', data: data});
        }
    })
})

module.exports=router;