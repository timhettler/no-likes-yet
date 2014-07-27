var app = angular.module('app');

var MediaCtrl = app.controller('MediaCtrl', function ($scope, $routeParams, $location, ipCookie, $q, instagramService) {
    var imagesPerPage = 8,
        worldCoordinates = [
            [40.781256, -73.966441],
            [43.518556, -73.67054],
            [42.457407, -2.449265],
            [43.117275, -76.248722],
            [35.245619, -101.821289],
            [61.227957, -149.897461],
            [45.521744, -122.67334],
            [-34.599722, -58.381944],
            [-41.47566, -72.949219],
            [28.410067, -81.583699],
            [38.68551, -96.503906],
            [41.7898354, -69.9897323],
            [30.24011, -97.712166],
            [67.855856, 20.225294],
            [48.8566667, 2.3509871],
            [40.0149856, -105.2705456],
            [43.2504393, -5.9832577],
            [41.512995, 14.063514],
            [40.65,-73.95],
            [33.8575,-117.87556],
            [39.1910983,-106.8175387]
        ],
        worldToken;

    $scope.toggleInfo = function () {
        $scope.showInfo = !$scope.showInfo;
    };

    $scope.toggleNav = function () {
        $scope.showMobileNav = !$scope.showMobileNav;
    };

    $scope.changeType = function (type) {
        $scope.type = type;

        if ($scope.view[type].length === 0) {
            $scope.getMedia();
        }

        //$location.path('/media/'+type);
    };

    var getRandomToken = function () {
        return Math.floor(Math.random() * (worldCoordinates.length - 1));
    };

    var getUserData = function () {
        instagramService.getSelfData()
            .then(function (user) {
                console.log('got user data');
                $scope.user = user;

                $scope.media[$scope.user.id] = {
                    pagination: {},
                    data: []
                };

                $scope.busy = false;

                $scope.getMedia();
            },
            function (meta) {
                console.log('access token invalid');
                instagramService.setAccessToken(null);
                ipCookie.remove('access_token');
                $location.url('/', true);
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

    $scope.getUserMediaPage = function (userId) {
        var deferred = $q.defer(),
            media = [],
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
    };

    var getWorldMediaPage = function (coords) {
        var deferred = $q.defer(),
            media = [],
            getData = function () {
                var next_max_id = ($scope.worldMedia[worldToken].max_timestamp) ? $scope.worldMedia[worldToken].max_timestamp : null;
                instagramService.getWorldMedia(coords, next_max_id)
                    .then(function (result) {
                        deferred.resolve(result);
                    });
            };
        if ($scope.worldMedia[worldToken].max_timestamp !== false) {
            getData();
        }

        return deferred.promise;
    };

    var getWorldPage = function () {
        var deferred = $q.defer(),
            media = [],
            getNextPage = function () {
                worldToken = getRandomToken();
                getWorldMediaPage(worldCoordinates[worldToken])
                    .then(function (result) {
                        console.log('found %s images for %s', filterLikedMedia(result.data).length, worldCoordinates[worldToken].join());
                        $scope.worldMedia[worldToken].max_timestamp = result.data[result.data.length - 1].created_time - 1000;
                        $scope.worldMedia[worldToken].data = $scope.worldMedia[worldToken].data.concat(filterLikedMedia(result.data));
                        media = media.concat(filterLikedMedia(result.data));
                        if (media.length < imagesPerPage) {
                            getNextPage();
                        } else {
                            deferred.resolve(media);
                        }
                    },
                    function () {
                        if (falseCount < worldCoordinates.length) {
                            getNextPage();
                        } else {
                            deferred.resolve(media);
                        }
                    });
            };

        getNextPage();

        return deferred.promise;
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

    $scope.getMedia = function () {
        if($scope.busy) {return;}

        $scope.busy = true;

        if ($scope.type === 'self') {
            $scope.getUserMedia($scope.user)
                .then(function (media) {
                    $scope.view.self = $scope.view.self.concat(media);
                    $scope.busy = false;
                });
        } else if ($scope.type === 'friends') {
            $scope.busy = true;

            getFollowingList()
                .then(function () {
                    getFollowerPage()
                        .then(function (media) {
                            $scope.view.friends = $scope.view.friends.concat(media);
                            console.log('follower page', media);
                            $scope.busy = false;
                        });
                });


        } else if ( $scope.type === 'world' ) {
            $scope.busy = true;

            if ($scope.worldMedia.length === 0) {
                worldCoordinates.forEach(function (v,i) {
                    $scope.worldMedia[i] = {
                        max_timestamp: Math.round((Date.now()/1000) - (3600 * (Math.random() * 36) )), // buffer to make photos seem more random
                        data: []
                    };
                });
            }

            getWorldPage()
                .then(function (media) {
                    $scope.view.world = $scope.view.world.concat(media);
                    console.log('world page', media);
                    $scope.busy = false;
                });
        }
    };


    var init = function () {
        $scope.busy = true;
        $scope.showInfo = false;
        $scope.showMobileNav = false;
        $scope.followingToken = 0;
        $scope.following = [];
        $scope.followingMedia = [];
        $scope.worldMedia = [];
        $scope.media = {};
        $scope.type = $routeParams.type;
        $scope.view = {
            world: [],
            friends: [],
            self: []
        };

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
