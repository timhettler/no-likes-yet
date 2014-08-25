angular.module('app')
.directive('media', function(instagramService, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: "=",
            type: "@"
        },
        controller: function ($scope, CTA) {
            $scope.cta = CTA[Math.floor(Math.random() * CTA.length)];
        },
        link: function  (scope, element) {
            var touchedOnce = false;

            element.find('.media__overlay')
                .on('click', function () {
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

            element.toggleClass('can-like', scope.type !== 'self');

            element.find('.media__overlay img')
                .on('load', function () {
                    element.removeClass('is-hidden');
                });
        },
        templateUrl: 'templates/media.tpl.html',
    };
});
