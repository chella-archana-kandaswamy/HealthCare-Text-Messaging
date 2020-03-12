var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  _id: {
    type:String
  },
  symptomNo:{
     type:Array
   },
    severNo:{
        type:Array
    },
    count:{
         type:String
    },
    status:{
        type:String
    }
});


/*const dataSchema = new mongoose.Schema({});
const examiner = mongoose.model('examiner', dataSchema, 'examiner');*/

var user = mongoose.model('user', userSchema);
module.exports = user;
