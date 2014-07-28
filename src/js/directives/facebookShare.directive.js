angular.module('app')
.directive('fbShare', function ($location) {
    return {
        link: function (scope, elem, attrs, ctrl) {
            elem.on('click', function (e) {
                e.preventDefault();
                FB.ui({
                    method: 'share',
                    href: $location.absUrl()
                }, function(response){});
                return false;
            });
        }
    };
});
