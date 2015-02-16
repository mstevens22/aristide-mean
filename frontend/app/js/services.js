'use strict';

/* Services */

var aristideServices = angular.module('aristideServices', ['ngResource']);


aristideServices.factory('Customer', ['$resource', 'Utilities',
  function($resource, Utilities){
    return $resource('http://localhost:8090/customer/:queryType/:param', {}, {
      query: {method:'GET', params:{queryType: 'regular', param: null}, isArray:true},
      get: {params:{queryType: 'regular'}, transformResponse: Utilities.castResponseObjectModel},
      save: {method:'POST', params:{queryType: 'regular', param: null}, transformResponse: Utilities.castResponseObjectModel},
      update: {method:'PUT', params:{queryType: 'regular', param: null}, transformResponse: Utilities.castResponseObjectModel},
      delete: {method:'DELETE', params:{queryType: 'regular', param: null}},
      queryByName: {method:'GET', params:{queryType: 'search', param: null}, isArray:true},
    });    
  }]);


aristideServices.factory('Booking', ['$resource', 'Utilities',
  function($resource, Utilities){
    return $resource('http://localhost:8090/booking/:queryType/:param/:param1/:param2', {}, {
      getRooms: {method:'GET', params:{queryType: 'room', param: null}, isArray:true},
      getStayTypes: {method:'GET', params:{queryType: 'stayType', param: null}, isArray:true},
      getPassTypes: {method:'GET', params:{queryType: 'passType', param: null}, isArray:true},
      checkAvailability: {method:'GET', params:{queryType: 'availibity', param: Date.now, param1: Date.now}},
      save: {method:'POST', params:{queryType: 'booking', param: null, param1: null}, transformResponse: Utilities.castResponseObjectModel},
      deleteConsumption: {method:'DELETE', params:{queryType: 'consumption', param: null, param1: null}},
      updateConsumption: {method:'PUT', params:{queryType: 'consumption', param: null, param1: null}},
      addConsumption: {method:'POST', params:{queryType: 'consumption', param: null, param1: null}, transformResponse: Utilities.castResponseObjectModel},
      get: {params:{queryType: 'booking'}, transformResponse: Utilities.castResponseObjectModel},
      getOfTheDay: {params:{queryType: 'oftheday', param: 'checkin', param1: Date.now, param2: Date.now}, transformResponse: Utilities.castResponseObjectModel},      
    });    
  }]);


/* Miscellanious class*/
aristideServices.factory("Utilities", function() {                                                                                                                                                   
     var glob = {                                                                                                                                                                                                              
        castResponseObjectModel: function(data) {        
	        data = angular.fromJson(data);
			  if (data instanceof Object || data instanceof Array) {    	
			  	for (var j in data){    		
			      	if (data[j] instanceof Object || data[j] instanceof Array) {			      		
					  	glob.castResponseObjectModel(data[j])
					  } else if(typeof data[j] == "string" && moment(data[j]).isValid()) {					  	
					  	data[j] = new Date(data[j]);
					  }		  
			     }
			  } else if (typeof data == "string" && moment(data).isValid()) {
			  		data = new Date(data);
			  }
			 return data;
       }, 
       bookingDaysLeft: function(booking){
       		//Check its dates       		
       		if (moment().diff(moment(booking.endDate), 'days') < 0) {
       			if (booking.consumptions.length > 0) {
	       			//Loop over consumption
	       			var totalDaysConsumption = 0;
	       			for (var indice in booking.consumptions){
	       				//console.log('Cats: '+booking.consumptions[indice].cats.length);
	       				totalDaysConsumption += (moment(booking.consumptions[indice].checkout).diff(booking.consumptions[indice].checkin, 'days'))*booking.consumptions[indice].cats.length;
	       			}	       						
	       			return (booking.duration - totalDaysConsumption);
       			} else { return booking.duration;}
       		}           
       		return NaN;
       },
       dataGridFormatAvailabity: function(bookings, checkin, checkout){        
          if (bookings.length > 0) {
              var dateRange = moment(checkout).diff(checkin, 'days');              
              var dataGrid = [];             
              for (var i in bookings) {
                for (var j in bookings[i].consumptions) {
                  if (moment(bookings[i].consumptions[j].checkin).diff(checkout, 'days') < 0 && moment(bookings[i].consumptions[j].checkout).diff(checkin, 'days') > 0){
                    var roomLabel = bookings[i].consumptions[j].room.label;
                    for (var k=0; k<dateRange; k++)  {
                      var currentDay = moment(checkin).add(k, 'day');
                      if (moment(bookings[i].consumptions[j].checkin).diff(currentDay, 'days') <= 0 && moment(bookings[i].consumptions[j].checkout).diff(currentDay, 'days') > 0) {//If consumption belongs to sought range                        
                        var currentDayStr = currentDay.format('DD-MM-YYYY').toString();
                        if (!angular.isDefined(dataGrid[currentDayStr])){                       
                          dataGrid[currentDayStr] = [];                
                        }
                        if(!angular.isDefined(dataGrid[currentDayStr][roomLabel])){
                          dataGrid[currentDayStr][roomLabel] = [];
                          dataGrid[currentDayStr][roomLabel]['cats'] = [];
                        }
                          for (var z=0; z < bookings[i].consumptions[j].cats.length; z++) {
                            dataGrid[currentDayStr][roomLabel]['cats'].push(bookings[i].consumptions[j].cats[z].name);
                          }                                                                          
                      }                      
                    }                    
                  }                  
                }               
              }              
            return dataGrid;
          } else {
            return [];
          }                   
       },       
       getDataRange: function(checkin, checkout){ 
              var dateRange = [];              
              var dateRangeNbr = moment(checkout).diff(checkin, 'days');
              for (var k=0; k<dateRangeNbr; k++)  {
                dateRange.push(moment(checkin).add(k, 'day').format('DD-MM-YYYY').toString());                                      
              }
              return dateRange;
       },
    };
    return glob;     
});