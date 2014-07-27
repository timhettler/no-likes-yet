angular.module('app')
.directive('twShare', function () {
    return {
        link: function (scope, elem, attrs, ctrl) {
            elem.on('click', function (e) {
                debugger;
                e.preventDefault();
                window.open(attr.href, 'twitter', 'width=500,height=300');
                return false;
            });
        }
    };
});
