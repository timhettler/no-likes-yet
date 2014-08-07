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
            [39.1910983,-106.8175387],
            [42.3584308,-71.0597732],
            [41.850033,-87.6500523],
            [34.0522342,-118.2436849],
            [37.7749295,-122.4194155],
            [35.6894875,139.6917064],
            [37.566535,126.9779692],
            [59.939039,30.315785],
            [43.234782,-76.224604],
            [43.036227,-76.136456],
            [13.7234186,100.4762319],
            [39.904667,116.408198],
            [4.609866,-74.08205],
            [30.064742,31.249509],
            [28.635308,77.22496],
            [23.709921,90.407143],
            [23.129075,113.264423],
            [41.012379,28.975926],
            [-6.211544,106.845172],
            [24.893379,67.028061],
            [22.572646,88.363895],
            [6.441158,3.417977],
            [51.5001524,-0.1262362],
            [14.6010326,120.9761599],
            [19.4270499,-99.1275711],
            [55.755786,37.617633],
            [19.017656,72.856178],
            [34.6937378,135.5021651],
            [-22.9035393,-43.2095869],
            [-23.5489433,-46.6388182],
            [31.230708,121.472916],
            [39.120876,117.21503],
            [43.670233,-79.386755],
            [45.545447,-73.639076],
            [51.055149,-114.062438],
            [51.770615,-1.25507]
        ],
        worldToken;

    $scope.toggleView = function (string, boolean) {
        if(!string) {return;}
        $scope[string] = (boolean !== undefined) ? boolean : !$scope[string];
    };

    $scope.setType = function (type) {
        if($scope.type === type) { return; }

        $scope.toggleView('showError', false);
        $scope.toggleView('showInfo', false);

        $scope.type = type;

        $location.search('type', type);

        if ($scope.view[type].length === 0 && type !== 'search') {
            $scope.getMedia();
            $location.search('user', null);
        } else if (type === 'search') {
            if ($scope.searchInput) {
                $location.search('user', $scope.searchInput);
            } else if ( $location.search().user ) {
                $scope.searchInput = $location.search().user;
                $scope.searchForUser();
            }
        }

        return $scope.type;
    };

    $scope.searchForUser = function () {
        if (!$scope.searchInput) { return; }
        $scope.busy['search'] = true;
        $scope.view.search = [];
        $scope.toggleView('showError', false);

        instagramService.getUserData($scope.searchInput)
            .then(function (user) {
                $scope.busy['search'] = false;
                $location.search('user', user.username);
                $scope.searchUser = user;
                if (!$scope.media[user.id]) {
                    initUserMedia(user.id);
                }
                $scope.getMedia();
            }, function (result) {
                $scope.busy['search'] = false;
                setErrorMessage('Stop making things up.', 'That user couldn\'t be found. Try searching for someone else.');
                $scope.toggleView('showError', true);
            });
    };

    var setErrorMessage = function (headline, copy) {
        $scope.errorHeadline = headline;
        $scope.errorCopy = copy;
    };

    var getRandomToken = function () {
        return Math.floor(Math.random() * (worldCoordinates.length - 1));
    };

    var getUserData = function () {
        instagramService.getSelfData()
            .then(function (user) {
                console.log('got user data');
                $scope.user = user;

                initUserMedia($scope.user.id);

                $scope.setType($routeParams.type || 'world');
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
        } else {
            deferred.reject();
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
        } else {
            deferred.reject();
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
                        falseCount++;
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
                        initUserMedia(user.id);
                    });

                    deferred.resolve();
                });
        }

        return deferred.promise;
    };

    var initUserMedia = function (userId) {
        $scope.media[userId] = {
            pagination: {},
            data: []
        };
    };

    $scope.getMedia = function () {
        if($scope.busy[$scope.type]) {return;}

        if ($scope.type === 'self') {
            $scope.busy['self'] = true;
            $scope.getUserMedia($scope.user)
                .then(function (media) {
                    $scope.view.self = $scope.view.self.concat(media);
                    $scope.busy['self'] = false;
                },
                function () {
                    console.log('all media found for self');
                    $scope.busy['self'] = false;
                });
        } else if ($scope.type === 'friends') {
            $scope.busy['friends'] = true;

            getFollowingList()
                .then(function () {
                    getFollowerPage()
                        .then(function (media) {
                            $scope.view.friends = $scope.view.friends.concat(media);
                            console.log('follower page', media);
                            $scope.busy['friends'] = false;
                        });
                });


        } else if ( $scope.type === 'world' ) {
            $scope.busy['world'] = true;

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
                    $scope.busy['world'] = false;
                });
        } else if ( $scope.type === 'search' ) {
            if (!$scope.searchUser) { return; }
            $scope.busy['search'] = true;

            if ($scope.media[$scope.searchUser.id].data.length > 0 && $scope.view.search.length === 0) {
                $scope.view.search = $scope.media[$scope.searchUser.id].data;
            }

            $scope.getUserMedia($scope.searchUser)
                .then(function (media) {
                    $scope.view.search = $scope.view.search.concat(media);
                    console.log('search page', media);
                    $scope.busy['search'] = false;
                },
                function () {
                    console.log('all media found for '+$scope.searchUser.username);
                    $scope.busy['search'] = false;
                });
        }
    };


    var init = function () {
        $scope.busy = {
            world: false,
            friends: false,
            self: false,
            search: false
        };
        $scope.showInfo = false;
        $scope.showMobileNav = false;
        $scope.followingToken = 0;
        $scope.following = [];
        $scope.followingMedia = [];
        $scope.worldMedia = [];
        $scope.media = {};
        $scope.view = {
            world: [],
            friends: [],
            self: [],
            search: []
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
