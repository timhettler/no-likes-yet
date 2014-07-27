angular.module('app')
.directive('media', function(instagramService, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: "=",
            type: "@"
        },
        link: function  (scope, element) {
            var touchedOnce = false;

            element.on('click', function () {
                if (scope.type === 'self') { return; }

                if (touchedOnce) {
                    instagramService.setLike(scope.data.id);

                    element.fadeOut(500, function () {
                            element.remove();
                        });
                } else {
                    touchedOnce = true;
                    $timeout(function () {
                        touchedOnce = false;
                    }, 500);
                }
            });
        },
        templateUrl: 'templates/media.tpl.html',
    };
});
