angular.module('app')
.directive('media', function(instagramService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: "=",
            type: "@"
        },
        link: function  (scope, element) {
            element.on('click', function () {
                if (scope.type === 'self') { return; }

                instagramService.setLike(scope.data.id);

                element.fadeOut(500, function () {
                        element.remove();
                    });
            });
        },
        templateUrl: 'templates/media.tpl.html',
    };
});
