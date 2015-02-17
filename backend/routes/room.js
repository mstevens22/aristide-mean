/** Rooms **/
var Room = require('../models/room.js');
module.exports = function(app) {
  /**
   * Find and retrieves all customer
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  findAllRooms = function(req, res) {
    console.log("GET - /room");
    return Room.find(function(err, rooms) {
      if(!err) {
        //console.log(customers[1].cats[0].birthDate instanceof Date);
        return res.send(rooms);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  //Link routes and actions  
  app.get('/booking/room', findAllRooms);
}