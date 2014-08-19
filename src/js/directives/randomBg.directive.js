angular.module('app')
.directive('randomBg', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            total: '@'
        },
        link: function (scope, elem, attrs, ctrl) {
            var num = Math.round(Math.random() * (scope.total - 1)) + 1;

            elem.addClass('nly-splash__bg--'+num);
        },
        template: '<div></div>'
    };
});
