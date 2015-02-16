/**
 * Customer
 *
 * @module        :: Routes
 * @description   :: Maps routes and actions
 * @author        :: Kevin Blanco
 */

var Customer = require('../models/customer.js');

module.exports = function(app) {


  /**
   * Find and retrieves all customer
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findAllCustomers = function(req, res) {
    console.log("GET - /customer");
    return Customer.find(function(err, customers) {
      if(!err) {
        //console.log(customers[1].cats[0].birthDate instanceof Date);
        return res.send(customers);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };



  /**
   * Find and retrieves a single customer by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findCustomerById = function(req, res) {

    console.log("GET - /customer/:id");
    return Customer.findById(req.params.id, function(err, customer) {

      if(!customer) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      if(!err) {
        return res.send({ status: 'OK', customer:customer });
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };


  /**
   * Find and retrieve customers by its Name
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findCustomersByName = function(req, res) {
    console.log("GET - /customer/search/:name");
    return Customer.find({ lastName: new RegExp('^'+req.params.name, "i") }, function(err, customers) {
      if(!err) {        
        return res.send(customers);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };


  /**
   * Creates a new customer from the data request
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  addCustomer = function(req, res) {

    console.log('POST - /customer');    

    var customer = new Customer({
      lastName:    req.body.lastName,
      firstName:    req.body.firstName,
      email :    req.body.email,
      phone:    req.body.phone,
      comments:    req.body.comments,
      cats: req.body.cats
    });

    customer.save(function(err) {

      if(err) {

        console.log('Error while saving customer: ' + err);
        res.send({ error:err });
        return;

      } else {

        console.log("Customer created");
        return res.send({ status: 'OK', customer:customer });
      }
    });
  };


  /**
   * Update a customer by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  updateCustomer = function(req, res) {

    console.log("PUT - /customer/:id");
    return Customer.findById(req.params.id, function(err, customer) {

      if(!customer) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      console.log('req'+req.body.cats);

      if (req.body.lastName != null) customer.lastName = req.body.lastName;
      if (req.body.firstName != null) customer.firstName = req.body.firstName;
      if (req.body.email != null) customer.email = req.body.email;
      if (req.body.phone != null) customer.phone = req.body.phone;
      if (req.body.comments != null) customer.comments = req.body.comments;
      if (req.body.cats != null) customer.cats = req.body.cats;

      return customer.save(function(err) {
        if(!err) {
          console.log('Updated');
          return res.send({ status: 'OK', customer:customer });
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

        res.send(customer);

      });
    });
  };



  /**
   * Delete a customer by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  deleteCustomer = function(req, res) {

    console.log("DELETE - /customer/:id");
    return Customer.findById(req.params.id, function(err, customer) {
      if(!customer) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      return customer.remove(function(err) {
        if(!err) {
          console.log('Removed customer');
          return res.send({ status: 'OK' });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          return res.send({ error: 'Server error' });
        }
      })
    });
  }

  //Link routes and actions
  app.get('/customer/regular', findAllCustomers);
  app.get('/customer/regular/:id', findCustomerById);
  app.post('/customer/regular', addCustomer);
  app.put('/customer/regular/:id', updateCustomer);
  app.delete('/customer/regular/:id', deleteCustomer);
  app.get('/customer/search/:name', findCustomersByName);

}