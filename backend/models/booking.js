/**
 * Customer
 *
 * @module      :: Model
 * @description :: Represent data model for a booking
 * @author        :: Mathias STEVENS
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Consumption = new Schema({
  cats:    {
    type    : Array,
    require : true
  },  
  room :   {
    type    : Object,
    require : true
  },
  checkin:       {
    type    : Date,
    require : true
  },
  checkout:       {
    type    : Date,
    require : true
  },
  comments :   {
    type    : String
  },
  state :   {
    type    : String,
    require : true
  },
  modified: {
    type    : Date,
    default : Date.now
  }
});

var Booking = new Schema({
  customer_id:    {
    type    : Schema.Types.ObjectId,
    require : true
  },  
  stay :          {
    type    : String,
    require : true
  },
  pass :          {
    type    : String,
    require : true
  },
  duration:       {
    type    : Number,
    require : true
  },
  startDate: {
    type    : Date,
    default : Date.now
  },
  endDate: {
    type    : Date,
    default : Date.now
  },  
  comments :          {
    type    : String
  },
  consumptions: [Consumption],
  modified: {
    type    : Date,
    default : Date.now
  }
});

module.exports = mongoose.model('Booking', Booking);