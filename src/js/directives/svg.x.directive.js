angular.module('app')
.directive('svgX', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/x.svg.tpl.html'
    };
});
