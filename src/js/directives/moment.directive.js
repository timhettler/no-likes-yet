angular.module('app')
.directive('momentFrom', [function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            time: "=",
            format: "="
        },
        link: function(scope, element, attrs, controller) {
            element.html(moment.unix(scope.time).from());
        }
    };
}]);
