/**
 * StayType
 *
 * @module      :: Model
 * @description :: Represent data model for a StayType
 * @author        :: Mathias STEVENS
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var StayType = new Schema({
  label:    {
    type    : String,    
    require : true
  },  
  comments :          {
    type    : String
  },
  modified: {
    type    : Date,
    default : Date.now
  }
});
module.exports = mongoose.model('StayType', StayType);


//db.staytypes.insert([{label: "Cool cat"}, {label: "Cosy cat"},{label: "Dandy cat"}])