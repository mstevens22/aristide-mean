'use strict';

/* Filters */

angular.module('aristideFilters', []).filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});
