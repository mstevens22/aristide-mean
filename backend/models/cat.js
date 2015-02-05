/**
 * Customer
 *
 * @module      :: Model
 * @description :: Represent data model for the Customer
 * @author        :: Mathias STEVENS
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Cat = new Schema({  
  name:    {
    type    : String,
    require : true
  },
  birthDate: {
    type    : Date
  }, 
  sexe:     {
    type    : String,
    enum    :  ['Male', 'Female'],
    require : true
  },  
  comments :   {
    type    : String,
    require : true
  },
  illustration :   {
    type    : String
  },
  modified: {
    type    : Date,
    default : Date.now
  }
});

module.exports = mongoose.model('Cat', Cat);