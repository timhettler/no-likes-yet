angular.module('app')
.directive('svgTwitter', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/twitter.svg.tpl.html'
    };
});
