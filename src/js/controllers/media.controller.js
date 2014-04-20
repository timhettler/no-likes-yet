var app = angular.module('app');

var MediaCtrl = app.controller('MediaCtrl', function ($scope, $routeParams, ipCookie, $q, instagramService) {
    var imagesPerPage = 9;

    var searchForUser = function (term) {
        console.log('searching for user %s...', term);
        instagramService.searchForUser(term)
            .then(function (result) {
                console.log('found user', result);
                $scope.user = result;
                createWall();
            }, function () {
                //TODO: user not found
                console.log('user not found');
            });
    };

    var filterLikedMedia = function (media) {
        var lonelyMedia = [];

        media.forEach(function (item) {
            if (item.likes.count === 0) {
                lonelyMedia.push(item);
            }
        });

        return lonelyMedia;
    };

    $scope.getUserMedia = function (user) {
        var deferred = $q.defer(),
            media = [],
            token = 0,
            getData = function () {
                var next_max_id = ($scope.media[user.id].pagination.next_max_id) ? $scope.media[user.id].pagination.next_max_id : null;
                instagramService.getUserMedia(user.id, next_max_id)
                    .then(function (result) {
                        if(result.data) {
                            media = media.concat(filterLikedMedia(result.data));
                        }

                        $scope.media[user.id].pagination = result.pagination;
                        token++;

                        if(media.length < imagesPerPage && result.pagination && result.pagination.next_max_id) {
                            getData();
                        } else {
                            if(!result.pagination.next_max_id) {
                                console.info('found all 0 likes for %s', user.username);
                                $scope.media[user.id].pagination = false;
                            }
                            console.info('found %s images for %s found in %s requests', media.length, user.username, token);
                            $scope.media[user.id].data = $scope.media[user.id].data.concat(media);
                            deferred.resolve(media);
                        }
                    });
            };

        if ($scope.media[user.id].pagination !== false) {
            getData();
        }

        return deferred.promise;
    };

    var getFollowingList = function () {
        var deferred = $q.defer();

        instagramService.getUserFollowing($scope.user.id)
            .then(function (following) {
                $scope.following = following;
                $scope.following.forEach(function (user) {
                    $scope.media[user.id] = {
                        pagination: {},
                        data: []
                    };
                });

                deferred.resolve(following);
            });

        return deferred.promise;
    };

    var getFollowerPage = function () {
        var token = 0,
            page = [];

            return $q.all($scope.following.map(function (user) {
                return $scope.getUserMedia(user);
            }));
    };

    var createWall = function () {

        $scope.media[$scope.user.id] = {
            pagination: {},
            data: []
        };

        $scope.getUserMedia($scope.user)
            .then(function (result) {
                $scope.media[$scope.user.id].data = result;
            });
    };


    var init = function (username) {
        $scope.user = instagramService.getUserData(username);
        $scope.following = [];
        $scope.followingMedia = [];
        $scope.media = [];

        if($scope.user) {
            createWall();
        } else {
            searchForUser($routeParams.username);
        }
    };

    init($routeParams.username);
});
