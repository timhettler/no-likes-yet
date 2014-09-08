angular.module('app')
.directive('svgHeart', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/heart.svg.tpl.html'
    };
});
