/**
 * Customer
 *
 * @module        :: Routes
 * @description   :: Maps routes and actions
 * @author        :: Kevin Blanco
 */

var Booking = require('../models/booking.js');
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = function(app) {

  /**
   * Find and retrieves a single customer by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findBookingByCustomerId = function(req, res) {

    console.log("GET - /booking/booking/:customer_id");
    
    return Booking.find({ $query: { customer_id: new ObjectId(req.params.customer_id)}, $orderby: { startDate: -1 }}, function(err, bookings) {      
      if(!bookings) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }
      if(!err) {
        return res.send({ status: 'OK', bookings:bookings });
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Creates a new customer from the data request
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  addBooking = function(req, res) {

    console.log('POST - /booking');


    var booking = new Booking({
      customer_id:    req.body.customer_id,
      stay:           req.body.stay,
      pass:           req.body.pass,
      duration :    req.body.duration,
      startDate:    req.body.startDate,
      endDate:    req.body.endDate,
      comments:    req.body.comments,
      consumptions: req.body.consumptions
    });

    booking.save(function(err) {

      if(err) {

        console.log('Error while saving customer: ' + err);
        res.send({ error:err });
        return;

      } else {

        console.log("Booking created");
        return res.send({ status: 'OK', booking:booking });
      }
    });
  };


  /**
   * Update a customer by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  updateBooking = function(req, res) {

    console.log("PUT - /booking/:id");
    return Booking.findById(req.params.id, function(err, booking) {

      if(!booking) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      if (req.body.customer_id != null) booking.customer_id = req.body.customer_id;
      if (req.body.stay != null) booking.stay = req.body.stay;
      if (req.body.pass != null) booking.pass = req.body.pass;
      if (req.body.duration != null) booking.duration = req.body.duration;
      if (req.body.startDate != null) booking.startDate = req.body.startDate;
      if (req.body.endDate != null) booking.endDate = req.body.endDate;
      if (req.body.comments != null) booking.comments = req.body.comments;
      if (req.body.consumptions != null) booking.consumptions = req.body.consumptions;      

      return booking.save(function(err) {
        if(!err) {
          console.log('Updated');
          return res.send({ status: 'OK', booking:booking });
        } else {
          if(err.name == 'ValidationError') {
            res.statusCode = 400;
            res.send({ error: 'Validation error' });
          } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
          }
          console.log('Internal error(%d): %s',res.statusCode,err.message);
        }

        res.send(booking);

      });
    });
  };

  /**
   * Delete a customer by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  deleteBooking = function(req, res) {

    console.log("DELETE - /booking/:id");
    return Booking.findById(req.params.id, function(err, booking) {
      if(!booking) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      return booking.remove(function(err) {
        if(!err) {
          console.log('Removed booking');
          return res.send({ status: 'OK' });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          return res.send({ error: 'Server error' });
        }
      })
    });
  }

  /**
   * Find and retrieves a single customer by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findBookingByConsumptionDateRange = function(req, res) {

    console.log("GET - /booking/availability/:date1/:date2");  
    
    return Booking.find({ 'consumptions.checkin': {$lte: new Date(req.params.date2)}, 'consumptions.checkout': {$gte: new Date(req.params.date1)}}, function(err, bookings) {
      if(!bookings) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }
      if(!err) {
        return res.send({ status: 'OK', bookings:bookings });
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Searching a booking starting or ending between a specific range of dates
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findBookingByConsumptionDate = function(req, res) {

    console.log("GET - /booking/oftheday/:inorout/:date1/:date2");

    if (req.params.inorout == "checkin") {
      var search = { 'consumptions.checkin': {$lte: new Date(req.params.date2), $gt: new Date(req.params.date1)}};
    } else {
      var search = { 'consumptions.checkout': {$lte: new Date(req.params.date2), $gt: new Date(req.params.date1)}};
    }    

    return Booking.find(search, function(err, bookings) {
      if(!bookings) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }
      if(!err) {
        return res.send({ status: 'OK', bookings:bookings });
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Delete a customer by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  deleteConsumption = function(req, res) {

    console.log("DELETE - /booking/consumption/:bid/:cid");
    return Booking.findById(req.params.bid, function(err, booking) {
      if(!booking) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

       booking.consumptions.id(req.params.cid).remove();
       return booking.save(function(err) {
        if(!err) {
          console.log('Removed consumption');
          return res.send({ status: 'OK' });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          return res.send({ error: 'Server error' });
        }
      })
    });
  }
/**
   * Delete a customer by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  addConsumption = function(req, res) {

    console.log("POST - /booking/consumption/:bid");
    return Booking.findById(req.params.bid, function(err, booking) {
      if(!booking) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      booking.consumptions.push(req.body);

       return booking.save(function(err) {
        if(!err) {
          console.log('Added consumption');
          return res.send({ status: 'OK', consumption:booking.consumptions[0] });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          return res.send({ error: 'Server error' });
        }
      })
    });
  }
  /**
   * Update a Consumption by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  updateConsumption = function(req, res) {

    console.log("PUT - /booking/consumption/:bid/:cid");

    var set = {};
    set['consumptions.$.checkin'] = req.body.checkin;
    set['consumptions.$.checkout'] = req.body.checkout;
    set['consumptions.$.cats'] = req.body.cats;
    if (req.body.comments != null) set['consumptions.$.comments'] = req.body.comments;
    set['consumptions.$.room'] = req.body.room;
    if (req.body.state != null)  set['consumptions.$.state'] = req.body.state;

    Booking.update({_id: req.params.bid, "consumptions._id": req.params.cid},  {$set: set},  
        function(err, numAffected) {
          if(!err) {
            console.log('Updated');
            return res.send({ status: 'OK', 'Affected':numAffected });
          } else {
            if(err.name == 'ValidationError') {
              res.statusCode = 400;
              res.send({ error: 'Validation error' });
            } else {
              res.statusCode = 500;
              res.send({ error: 'Server error' });
            }
            console.log('Internal error(%d): %s',res.statusCode,err.message);
          }        
          res.send();
        }
    );
  }

  //Link routes and actions  
  app.get('/booking/booking/:customer_id', findBookingByCustomerId);  
  app.post('/booking/booking', addBooking);  
  app.put('/booking/booking/:id', updateBooking);
  app.delete('/booking/booking/:id', deleteBooking);
  app.get('/booking/availibity/:date1/:date2', findBookingByConsumptionDateRange);
  app.delete('/booking/consumption/:bid/:cid', deleteConsumption);
  app.put('/booking/consumption/:bid/:cid', updateConsumption);
  app.post('/booking/consumption/:bid', addConsumption);
  app.get('/booking/oftheday/:inorout/:date1/:date2', findBookingByConsumptionDate);
}