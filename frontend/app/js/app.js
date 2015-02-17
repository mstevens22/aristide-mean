'use strict';

/* App Module */

var aristideApp = angular.module('aristideApp', [
  'ngRoute',
  'ngAnimate',
  'ngUpload',
  'aristideControllers',
  'aristideFilters',
  'aristideServices',
  'angularMoment'
]);

aristideApp.constant('CONFIG', {
  //host: 'http://localhost:8090'
  host: 'http://10.240.237.154:8080'
});


aristideApp.config(['$routeProvider', 
  function($routeProvider) {
    $routeProvider.
      when('/customer', {
        templateUrl: 'partials/customer-list.html',
        controller: 'CustomerListCtrl'
      }).
      when('/customer/:customerId', {
        templateUrl: 'partials/customer-detail.html',
        controller: 'CustomerDetailCtrl'
      }).
      when('/booking/:customerId', {
        templateUrl: 'partials/customer-booking.html',
        controller: 'CustomerBookingCtrl'
      }).
      when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
