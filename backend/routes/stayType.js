/** **/
var StayType = require('../models/stayType.js');
module.exports = function(app) {
  /**
   * Find and retrieves all customer
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findAllStayType = function(req, res) {
    console.log("GET - /stayType");
    return StayType.find(function(err, stayTypes) {
      if(!err) {        
        return res.send(stayTypes);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  //Link routes and actions  
  app.get('/booking/stayType', findAllStayType);
}