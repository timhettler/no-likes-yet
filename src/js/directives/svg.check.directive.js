angular.module('app')
.directive('svgCheck', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/check.svg.tpl.html'
    };
});
