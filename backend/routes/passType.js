/** **/
var PassType = require('../models/passType.js');
module.exports = function(app) {
  /**
   * Find and retrieves all customer
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findAllPassType = function(req, res) {
    console.log("GET - /passType");
    return PassType.find(function(err, passTypes) {
      if(!err) {        
        return res.send(passTypes);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  //Link routes and actions  
  app.get('/booking/passType', findAllPassType);
}