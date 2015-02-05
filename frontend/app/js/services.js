'use strict';

/* Services */

var aristideServices = angular.module('aristideServices', ['ngResource']);

aristideServices.factory('Customer', ['$resource',
  function($resource){
    return $resource('http://localhost:8090/customer/:customerId', {}, {
      query: {method:'GET', params:{customerId: null}, isArray:true},
      save: {method:'POST'},
      update: {method:'PUT', params:{customerId: null}},
      delete: {method:'DELETE', params:{customerId: null}},
    });
  }]);