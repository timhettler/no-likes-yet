angular.module('app')
.directive('svgFacebook', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/facebook.svg.tpl.html'
    };
});
