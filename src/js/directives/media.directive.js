angular.module('app')
.directive('media', function(instagramService, $timeout, $rootScope) {
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

            var transEndEventNames = {
                'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
                'MozTransition'    : 'transitionend',      // only for FF < 15
                'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
            },
            transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

            var doLike = function () {
                element.addClass('is-liked').one(transEndEventName, function () {
                    $timeout(function () {
                        element.addClass('is-hidden');
                    }, 900);
                });
                // instagramService.setLike(scope.data.id);
            };

            element.find('.media-overlay')
                .on('click', function () {

                    if (!Modernizr.touch && scope.type !== 'self') {
                        doLike();
                    } else {
                        if (touchedOnce) {
                            if (scope.type !== 'self') {
                                doLike();
                            } else {
                                touchedOnce = false;
                                element.removeClass('is-active');
                            }
                        } else {
                            scope.$emit('MEDIA_TAPPED', element);
                            touchedOnce = true;
                            element.addClass('is-active');
                        }
                    }
                });

            $rootScope.$on('MEDIA_TAPPED', function (tappedElem) {
                if (tappedElem !== element) {
                    touchedOnce = false;
                    element.removeClass('is-active');
                }
            });
        },
        templateUrl: 'templates/media.tpl.html',
    };
});
