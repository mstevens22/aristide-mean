'use strict';

/* App Module */

var aristideApp = angular.module('aristideApp', [
  'ngRoute',
  'ngAnimate',
  'aristideControllers',
  'aristideFilters',
  'aristideServices'
]);


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
      otherwise({
        redirectTo: '/customer'
      });
  }]);
