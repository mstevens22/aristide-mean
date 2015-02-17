/**
 * PassType
 *
 * @module      :: Model
 * @description :: Represent data model for a PassType
 * @author        :: Mathias STEVENS
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PassType = new Schema({
  label:    {
    type    : String,    
    require : true
  },  
  duration :          {
    type    : Number,    
    require : true
  },  
  modified: {
    type    : Date,
    default : Date.now
  }
});
module.exports = mongoose.model('PassType', PassType);


// db.passtypes.insert([{label: "A la journée", duration: 1}, {label: "Week-End", duration: 2},
//                     {label: "Traveller 10j", duration: 10},{label: "Traveller 20j", duration: 20},
//                     {label: "Traveller 30j", duration: 30},{label: "Sur mesure", duration: 0},])