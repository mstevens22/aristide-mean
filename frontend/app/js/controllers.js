'use strict';

/* Controllers */

var aristideControllers = angular.module('aristideControllers', []);

aristideControllers.controller('CustomerListCtrl', ['$scope', 'Customer',
  function($scope, Customer) {
    $scope.customers = Customer.query();
    $scope.orderProp = 'lastName';

    $scope.remove = function(customerId, index) {          
        Customer.delete({customerId: customerId}, function(data){
            console.log(data);
            if (data.status == 'OK') {  
            //$scope.customers = Customer.query();//Update the list
            $scope.customers.splice(index, 1);         
            } else {/*if not successful, bind errors to error variables*/}
        });
      };

  }]);

aristideControllers.controller('CustomerDetailCtrl', ['$scope', '$routeParams','$location', '$timeout', 'Customer',
  function($scope, $routeParams,$location, $timeout, Customer) {        
        if ($routeParams.customerId == 'add') {
          $scope.customer = null;
          $scope.actionType = 'add';
        } else {
          $scope.actionType = 'update';
           Customer.get({customerId: $routeParams.customerId}, 
            function(data) {            
              $scope.customer = data.customer;
              //Request his cats as he is already registered     
            }, 
           function(err) {            
            $scope.customer = null;
            $scope.actionType = 'add';
           });
        }

     $scope.update = function(customer) {
        $scope.successMessage=null;  
        Customer.update({customerId: customer._id}, customer, function(data){
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
      $scope.sexes = ['male', 'female'];
  }]);