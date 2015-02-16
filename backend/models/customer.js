/**
 * Customer
 *
 * @module      :: Model
 * @description :: Represent data model for the Customer
 * @author        :: Mathias STEVENS
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//var Cat = require('./cat.js');
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
    enum    :  ['male', 'female'],
    require : true
  },  
  comments :   {
    type    : String
  },
  illustration :   {
    type    : String
  },
  modified: {
    type    : Date,
    default : Date.now
  }
}, {
    toObject: {virtuals: true}
    ,toJSON: {virtuals: true}
  });

// Cat.virtual('birthDateFull').get(function () {
//   return new Date(this.birthDate);
// });


var Customer = new Schema({

  lastName:    {
    type    : String,
    require : true
  },
  firstName:    {
    type    : String,
    require : true
  },  
  email:     {
    type    : String,
    require : true
  },
  phone:   {
    type: String
  },
  comments :   {
    type    : String,
    require : true
  },
  modified: {
    type    : Date,
    default : Date.now
  },
  cats: [Cat]
}, {
    toObject: {virtuals: true}
    ,toJSON: {virtuals: true}
  });

Customer.path('email').validate(function (v) {
  return ((v != "") && (v != null));
});

module.exports = mongoose.model('Customer', Customer);