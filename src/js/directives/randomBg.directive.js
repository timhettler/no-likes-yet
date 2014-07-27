angular.module('app')
.directive('randomBg', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            total: '@',
            path: '@',
            token: '@'
        },
        link: function (scope, elem, attrs, ctrl) {
            var num = Math.round(Math.random() * (scope.total - 1)) + 1,
                truePath = scope.path.replace(scope.token, num);

            elem.css('background-image', 'url('+truePath+')');
        },
        template: '<div></div>'
    };
});
