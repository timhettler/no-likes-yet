angular.module('app')
.directive('fbShare', function () {
    return {
        link: function (scope, elem, attrs, ctrl) {
            elem.on('click', function () {
                FB.ui({
                    method: 'share',
                    href: 'https://www.no-likes-yet.com/'
                }, function(response){});
                return false;
            });
        }
    };
});
