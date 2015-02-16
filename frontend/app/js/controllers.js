'use strict';

/* Controllers */
/* Todo 
  - Must try to find a way to avoid using the dirty hack of 'document.domain' in order to let the frames talk
*/

var aristideControllers = angular.module('aristideControllers', []);

aristideControllers.controller('HomeCtrl', ['$scope', 'Customer', 'Booking', 'Utilities',
  function($scope, Customer, Booking, Utilities) {
    var thisMorning = moment().format('YYYY-MM-DDT00:00:00');
    var thisNight = moment().add(1, 'days').format('YYYY-MM-DDT00:00:00');
    
    Booking.getOfTheDay({param: 'checkin', param1: thisMorning, param2: thisNight},
        function(data) {
            if (data.status == 'OK') {              
              var checkinOfTheDay = data.bookings;
              for (var i = 0; i < checkinOfTheDay.length; i++){//Have to remove other booking
                for (var j = 0; j < checkinOfTheDay[i].consumptions.length; j++){
                    if(moment(checkinOfTheDay[i].consumptions[j].checkin).format('YYYY-MM-DDT00:00:00') != thisMorning) {
                        checkinOfTheDay[i].consumptions.splice(j, 1);
                    }                      
                }
              }
              $scope.checkinOfTheDay = checkinOfTheDay;
            } else {/*if not successful, bind errors to error variables*/}
        });

    Booking.getOfTheDay({param: 'checkout', param1: thisMorning, param2: thisNight},
        function(data) {
            if (data.status == 'OK') {              
              var checkoutOfTheDay = data.bookings;              
              for (var i = 0; i < checkoutOfTheDay.length; i++){//Have to remove other booking
                for (var j = 0; j < checkoutOfTheDay[i].consumptions.length; j++){
                    if(moment(checkoutOfTheDay[i].consumptions[j].checkout).format('YYYY-MM-DDT00:00:00') != thisMorning) {
                        checkoutOfTheDay[i].consumptions.splice(j, 1);
                    }                      
                }
              }
              $scope.checkoutOfTheDay = checkoutOfTheDay;
            } else {/*if not successful, bind errors to error variables*/}
        });

    /* All this code must BE refactored */
    $scope.checkAvailability = function(checkin, checkout) {
      Booking.checkAvailability({param: checkin, param1: checkout}, function(data){
            if (data.status == 'OK') {              
              $scope.dataRange = Utilities.getDataRange(checkin, checkout);              
              $scope.dataRangeGrid = Utilities.dataGridFormatAvailabity(data.bookings, checkin, checkout);              
            } else {/*if not successful, bind errors to error variables*/}
        });
    } 
    
    $scope.setDateConsistency = function() {      
      $scope.dfltCheckout = moment($scope.booking.consumption.checkin).format("YYYY-MM-DDT00:00:00");
    }

    $scope.rooms = Booking.getRooms();
    $scope.dfltCheckin = moment().format("YYYY-MM-DDT00:00:00");    
    $scope.dfltCheckout = moment().add(1, 'days').format("YYYY-MM-DDT00:00:00");
    /* All this code must BE refactored */
  }]);

aristideControllers.controller('CustomerListCtrl', ['$scope', 'Customer',
  function($scope, Customer) {
    $scope.customers = Customer.query();    
    $scope.orderProp = 'lastName';    

    $scope.remove = function(customerId, index) {     
        Customer.delete({param: customerId}, function(data){  
                  console.log(data);     
            if (data.status == 'OK') {  
            //$scope.customers = Customer.query();//Update the list
            $scope.customers.splice(index, 1);        
            } else {/*if not successful, bind errors to error variables*/}
        });
      };

  }]);

aristideControllers.controller('CustomerBookingCtrl', ['$scope',  '$route', '$routeParams', '$timeout', 'Customer', 'Booking', 'Utilities',
  function($scope, $route, $routeParams, $timeout, Customer, Booking, Utilities) {
    Customer.get({param: $routeParams.customerId},
        function(data) {            
          $scope.customer = data.customer;
        }
    );

    Booking.get({param1: $routeParams.customerId},
            function(data) {
              $scope.bookings = [];  //Init du tableau de pass
              //There is previous purchases of subscriptions                               
                for (var indice in data.bookings) {
                  data.bookings[indice].daysLeft =  Utilities.bookingDaysLeft(data.bookings[indice]);                  
                  $scope.bookings.push(data.bookings[indice]);                  
                }                           
            });

    $scope.save = function() {
      $scope.successMessage=null;
        var booking = {};
        booking.customer_id = $scope.customer._id;
        booking.stay = $scope.booking.stayType.label;
        booking.pass = $scope.booking.passType.label;
        booking.duration = $scope.booking.duration;
        booking.startDate = moment();
        booking.endDate = moment().add(1, 'y');
        booking.comment = $scope.booking.consumption.comments;
        booking.consumptions = [$scope.booking.consumption];
  
        Booking.save(booking, function(data){
            if (data.status == 'OK') {
              console.log(data);
              data.booking.daysLeft =  Utilities.bookingDaysLeft(data.booking);
              $scope.bookings.unshift(data.booking);      
              //console.log($route.reload());              
              // $scope.customer = data.customer;
              //if successful, bind success message to message
              $scope.successMessage = 'Great my lord. Booking is made!!';                           
              $timeout(function(){$scope.successMessage=null;}, 5000);
            } else {/*if not successful, bind errors to error variables*/}
        });      
    }

    $scope.checkAvailability = function(checkin, checkout) {
      Booking.checkAvailability({param: checkin, param1: checkout}, function(data){
            if (data.status == 'OK') {              
              $scope.dataRange = Utilities.getDataRange(checkin, checkout);              
              $scope.dataRangeGrid = Utilities.dataGridFormatAvailabity(data.bookings, checkin, checkout);              
            } else {/*if not successful, bind errors to error variables*/}
        });
    }    

    $scope.addConsumption = function(index) {      
      $scope.bookings[index].consumptions.unshift({});
    }

    $scope.removeConsumption = function(parentIndex, index) {
      if($scope.bookings[parentIndex].consumptions[index]._id != null) {
        Booking.deleteConsumption({param: $scope.bookings[parentIndex]._id, param1: $scope.bookings[parentIndex].consumptions[index]._id, }, function(data){
            if (data.status == 'OK') {              
              //console.log(data);
            } else {/*if not successful, bind errors to error variables*/}
        });
      }
      $scope.bookings[parentIndex].consumptions.splice(index, 1);
      $scope.bookings[parentIndex].daysLeft = Utilities.bookingDaysLeft($scope.bookings[parentIndex]);
    }

     $scope.saveConsumption = function(parentIndex, index) {
        if (angular.isDefined($scope.bookings[parentIndex].consumptions[index]._id)){//It is un aupdate
          Booking.updateConsumption({param: $scope.bookings[parentIndex]._id, param1: $scope.bookings[parentIndex].consumptions[index]._id}, $scope.bookings[parentIndex].consumptions[index], function(data){
            if (data.status == 'OK') {              
              $scope.successMessageForConsumption = "Update";
            } else {/*if not successful, bind errors to error variables*/}
          });
        } else {//It is a creation
            Booking.addConsumption({param: $scope.bookings[parentIndex]._id}, $scope.bookings[parentIndex].consumptions[index], function(data){
            if (data.status == 'OK') {              
              $scope.bookings[parentIndex].consumptions[index] = data.consumption;
              $scope.successMessageForConsumption = "Create";
            } else {/*if not successful, bind errors to error variables*/}
        });
      }
      $timeout(function(){$scope.successMessageForConsumption=null;}, 1000);
      $scope.bookings[parentIndex].daysLeft = Utilities.bookingDaysLeft($scope.bookings[parentIndex]);
    }

    $scope.consumptionIsOver = function(consumption) {
      return moment().diff(consumption.checkout, 'days') > 0;
    }

    $scope.setDateConsistency = function() {      
      $scope.dfltCheckout = moment($scope.booking.consumption.checkin).format("YYYY-MM-DDT00:00:00");      
    }

    $scope.rooms = Booking.getRooms();    
    $scope.stayTypes = Booking.getStayTypes();
    $scope.passTypes = Booking.getPassTypes();   
    $scope.states = ['A payer', 'Payé', 'Annulé'];
    $scope.dfltCheckin = moment().format("YYYY-MM-DDT00:00:00");    
    $scope.dfltCheckout = moment().add(1, 'days').format("YYYY-MM-DDT00:00:00");

  }]);

aristideControllers.controller('DataGridCtrl', ['$scope', 'Customer', 'Booking', 'Utilities',
  function($scope, Customer, Booking, Utilities) {
      
      $scope.setDataToGrid = function(data, room) {
      if (angular.isDefined($scope.dataRangeGrid[data]) && angular.isDefined($scope.dataRangeGrid[data][room.label]))   {                
          var cats = "";
          for (var i=0; i < $scope.dataRangeGrid[data][room.label].cats.length; i++){
              cats += $scope.dataRangeGrid[data][room.label].cats[i]+" ";
          }
          return cats;
      } else {
          return "";
      }
    }
    $scope.setClassToGrid = function(data, room) {
      if (angular.isDefined($scope.dataRangeGrid[data]) && angular.isDefined($scope.dataRangeGrid[data][room.label]))   {
          if ($scope.dataRangeGrid[data][room.label].cats.length < room.capacity){
            return "success";
          } else {
            return "danger";
          }                
      } else {
          return "success";
      }      
    }   
  }]);

aristideControllers.controller('CustomerDetailCtrl', ['$scope', '$routeParams','$location', '$timeout', 'Customer',
  function($scope, $routeParams,$location, $timeout, Customer) {        
        if ($routeParams.customerId == 'add') {
          $scope.customer = new Object;
          $scope.customer.cats = [];
          $scope.actionType = 'add';
        } else {
          $scope.actionType = 'update';
           Customer.get({param: $routeParams.customerId},
            function(data) {            
              $scope.customer = data.customer;                             
            }, 
           function(err) {            
            $scope.customer = null;
            $scope.actionType = 'add';
           });
        }

     $scope.update = function(customer) {
        $scope.successMessage=null;  
        Customer.update({param: customer._id}, customer, function(data){
            if (data.status == 'OK') {
              $scope.customer = data.customer; 
              // if successful, bind success message to message
              $scope.successMessage = 'Everything is fine. Customer updated successfully!!';
              $timeout(function(){$scope.successMessage=null;}, 5000);
            } else {/*if not successful, bind errors to error variables*/}
        });
      };

      $scope.save = function(customer) {
        $scope.successMessage=null;
        Customer.save(customer, function(data){
            if (data.status == 'OK') {
              $scope.customer = data.customer;
              // if successful, bind success message to message
              $scope.successMessage = 'Great my lord. Customer added successfully!!';
              $scope.actionType = 'update';
              $location.path('/customer/' + $scope.customer._id, false);
              $timeout(function(){$scope.successMessage=null;}, 5000);
            } else {/*if not successful, bind errors to error variables*/}
        });
      };

      $scope.checkExistingUser = function() {
        if ($scope.customer.lastName.length > 2) {
          console.log($scope.customer.lastName);
            Customer.queryByName({param: $scope.customer.lastName}, function(data){              
              $scope.suggestCustomers = data;
        });
        }        
      };
      //Upload needed methods
      $scope.uploadFile = function(content, completed) {        
        var data = jQuery.parseHTML(content);
        $scope.customer.cats[$scope.uploadIndex].illustration = data[1].innerHTML;
        $('#myModal').modal('toggle');
      };
      $scope.uploadStart = function() {        
        document.domain = 'localhost'; //dirty hack
      };

      $scope.setActiveIndex = function(index) {    
        $scope.uploadIndex = index;
      };

      $scope.sexes = ['male', 'female'];
  }]);