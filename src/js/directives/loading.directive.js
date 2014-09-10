angular.module('app')
.directive('loading', function ($location) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            type: '=',
            size: '=',
            busy: '=',
            complete: '='
        },
        controller: function ($scope, $element, $attrs) {
        },
        link: function (scope, element, attributes) {
        },
        templateUrl: 'templates/loading.tpl.html'
    };
});
