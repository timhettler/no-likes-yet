angular.module('app')
.directive('twShare', function () {
    return {
        link: function (scope, elem, attrs, ctrl) {
            elem.on('click', function (e) {
                e.preventDefault();
                window.open(attrs.href, 'twitter', 'width=500,height=300');
                return false;
            });
        }
    };
});
