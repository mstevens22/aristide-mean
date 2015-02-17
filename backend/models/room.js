/**
 * Customer
 *
 * @module      :: Room
 * @description :: Represent data model for a Room
 * @author        :: Mathias STEVENS
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Data not only for display
var Room = new Schema({
  label:    {
    type    : String,    
    require : true
  },  
  type :     {
    type    : String,  //suite ou simple 
    enum    :  ['suite', 'simple'], 
    require : true
  },
  capacity :     {
    type    : Number,  //suite ou simple     
  },
  modified: {
    type    : Date,
    default : Date.now
  }
});

module.exports = mongoose.model('Room', Room);


//db.rooms.insert([{label: "Chambre1",type: "suite", capacity: 4}, {label: "Chambre2",type: "suite", capacity: 4}, {label: "Chambre3",type: "simple", capacity: 2}, {label: "Chambre4",type: "simple", capacity: 2}])