var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var severitySchema = new Schema({

  severNo: {
    type:String
  },
  severText:{
     type:String
   }
});


//const dataSchema = new mongoose.Schema({});
//const questions = mongoose.model('questions', dataSchema, 'questions');

var severityModel = mongoose.model('severityModel', severitySchema);
module.exports = severityModel;
