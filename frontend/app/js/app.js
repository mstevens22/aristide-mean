'use strict';

/* App Module */

var aristideApp = angular.module('aristideApp', [
  'ngRoute',
  'ngAnimate',
  'ngUpload',
  'aristideControllers',
  'aristideFilters',
  'aristideServices',
  'angularMoment',
  'facebook'
]);

aristideApp.config([
    'FacebookProvider',
    function(FacebookProvider) {
     var myAppId = '1598114213740073';
     FacebookProvider.init(myAppId);
     
    }
  ])

aristideApp.constant('CONFIG', {
  // host: 'http://localhost:8090',
  // domain: 'localhost'
  host: 'http://api.aristide-hotel.com:8080',
  domain: 'aristide-hotel.com'  
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
