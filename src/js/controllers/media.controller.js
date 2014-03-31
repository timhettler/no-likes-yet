var app = angular.module('app');

var MediaCtrl = app.controller('MediaCtrl', function ($scope, $routeParams, instagramService) {

    var searchForUser = function (term) {
        console.log('searching for user %s...', term);
        instagramService.searchForUser(term)
            .then(function (result) {
                $scope.user = result;
                instagramService.getNoLikes($scope.user.id)
                    .then(function (media) {
                        $scope.media = media;
                    });
            }, function () {
                //TODO: user not found
            });
    };

    var getMedia = function () {
        instagramService.getNoLikes($scope.user.id)
            .then(function (media) {
                $scope.media = media;
            });
    };

    var init = function () {
        $scope.user = instagramService.getUserData($routeParams.username);

        if($scope.user) {
            getMedia();
        } else {
            searchForUser($routeParams.username);
        }
    };

    init();
});
