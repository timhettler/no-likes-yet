angular.module('app')
.directive('media', [function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: "="
        },
        templateUrl: 'templates/media.tpl.html',
    };
}]);
