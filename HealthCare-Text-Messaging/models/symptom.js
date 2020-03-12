var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var symptomSchema = new Schema({
  symptomText:{
     type:Array
   }
});

//const dataSchema = new mongoose.Schema({});
//const teams = mongoose.model('teams', dataSchema, 'teams');
var symptomModel = mongoose.model('symptomModel', symptomSchema);
module.exports = symptomModel;
