var app = angular.module('app');

var MediaCtrl = app.controller('MediaCtrl', function ($scope, $routeParams, ipCookie, $q, instagramService) {
    var imagesPerPage = 1;

    var getUserData = function () {
        $scope.user = instagramService.getUserData($routeParams.username);

        if($scope.user) {
            createWall();
        } else {
            console.log('searching for user %s...', $routeParams.username);
            instagramService.searchForUser($routeParams.username)
                .then(function (result) {
                    console.log('found user', result);
                    $scope.user = result;
                    createWall();
                }, function () {
                    //TODO: user not found
                    console.log('user not found');
                });
        }


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

    $scope.getUserMediaPage = function (userId) {
        var deferred = $q.defer(),
            media = [],
            token = 0,
            getData = function () {
                var next_max_id = ($scope.media[userId].pagination.next_max_id) ? $scope.media[userId].pagination.next_max_id : null;
                instagramService.getUserMedia(userId, next_max_id)
                    .then(function (result) {
                        deferred.resolve(result);
                    });
            };
        if ($scope.media[userId].pagination !== false) {
            getData();
        }

        return deferred.promise;
    };

    var getFollowerPage = function () {
        var deferred = $q.defer(),
            media = [],
            falseCount = 0,
            getNextPage = function () {
                var followerId = $scope.following[$scope.followingToken].id;
                $scope.getUserMediaPage(followerId)
                    .then(function (result) {
                        console.log('found %s images for %s', filterLikedMedia(result.data).length, $scope.following[$scope.followingToken].username);
                        $scope.media[followerId].pagination = result.pagination;
                        $scope.media[followerId].data = $scope.media[followerId].data.concat(filterLikedMedia(result.data));
                        media = media.concat(filterLikedMedia(result.data));
                        $scope.followingToken = ($scope.followingToken + 1) % $scope.following.length;
                        if (media.length < imagesPerPage) {
                            getNextPage();
                        } else {
                            deferred.resolve(media);
                        }
                    },
                    function () {
                        $scope.followingToken = ($scope.followingToken + 1 )% $scope.following.length;
                        if (falseCount < $scope.following.length) {
                            getNextPage();
                        } else {
                            deferred.resolve(media);
                        }
                    });
            };

        getNextPage();

        return deferred.promise;

            // return $q.all($scope.following.map(function (user) {
            //     return $scope.getUserMedia(user);
            // }));
    };

    var getFollowingList = function () {
        var deferred = $q.defer();

        if ($scope.following.length > 0) {
            deferred.resolve();
        } else {
            instagramService.getUserFollowing($scope.user.id)
                .then(function (following) {
                    fisherYates(following); //randmize
                    $scope.following = following;
                    $scope.following.forEach(function (user) {
                        $scope.media[user.id] = {
                            pagination: {},
                            data: []
                        };
                    });

                    deferred.resolve();
                });
        }

        return deferred.promise;
    };

    $scope.doScroll = function () {
        console.log($scope.busy);
        if (!$scope.busy) {
            createWall();
        }
    };

    var createWall = function () {
        console.log('getting wall');
        $scope.busy = true;
        // $scope.media[$scope.user.id] = {
        //     pagination: {},
        //     data: []
        // };

        // $scope.getUserMedia($scope.user)
        //     .then(function (result) {
        //         $scope.media[$scope.user.id].data = result;
        //     });

        getFollowingList()
            .then(function () {
                console.log('got following list');
                getFollowerPage()
                    .then(function (media) {
                        $scope.followingMedia = $scope.followingMedia.concat(media);
                        console.log('follower page', media);
                        $scope.busy = false;
                    });
            });
    };


    var init = function () {
        $scope.busy = true;
        $scope.followingToken = 0;
        $scope.following = [];
        $scope.followingMedia = [];
        $scope.media = {};

        getUserData();
    };

    init();
});

function fisherYates ( myArray ) {
  var i = myArray.length;
  if ( i === 0 ) {return false;}
  while ( --i ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = myArray[i];
     var tempj = myArray[j];
     myArray[i] = tempj;
     myArray[j] = tempi;
   }
}
