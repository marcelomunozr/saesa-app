angular.module('starter.services', [])
.directive('angularCompile', function($compile) {
	return function(scope, element, attrs) {
	    scope.$watch(
	        function(scope) {
	            return scope.$eval(attrs.angularCompile);
	        },
	        function(value) {
	            $compile(element.contents())(scope);
	        }
	    );
	};
})
;