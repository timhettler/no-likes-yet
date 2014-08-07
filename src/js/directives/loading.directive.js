angular.module('app')
.directive('loading', function ($location) {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        controller: function ($scope, $element, $attrs) {
            $scope.type = $attrs['type'];
        },
        link: function (scope, element, attributes) {
            attributes.$observe('size', function (newValue) {
                scope.size = newValue;
            });
        },
        templateUrl: 'templates/loading.tpl.html'
    };
});
