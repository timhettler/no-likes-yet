var app = angular.module('app');

var MediaCtrl = app.controller('MediaCtrl', function ($scope, $routeParams, $location, $timeout, $q, $log, ipCookie, instagramService, WORLD_COORDS) {
    var imagesPerPage = 8,
        worldCoordinates = WORLD_COORDS(),
        worldToken;

    $scope.toggleView = function (string, boolean) {
        if(!string) {return;}
        $scope[string] = (boolean !== undefined) ? boolean : !$scope[string];
    };

    $scope.closeMobileNav = function () {
        $timeout(function () {
            $scope.toggleView('showMobileNav', false);
        }, 500);
    };

    $scope.setType = function (type) {
        if($scope.type === type) { return; }

        $scope.toggleView('showError', false);
        $scope.toggleView('showInfo', false);

        $scope.type = type;

        $location.search('type', type);

        if ($scope.view[type].length === 0 && type !== 'search') {
            $location.search('user', null);
            $scope.getMedia();
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
        $scope.searchInput = $scope.searchInput.toLowerCase();

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
                setErrorMessage('Yikes!', 'Stop making things up. That user doens\'t exist.');
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
                $log.debug('got user data');
                $scope.user = user;

                initUserMedia($scope.user.id);

                $scope.setType($routeParams.type || 'world');
            },
            function (meta) {
                $log.debug('access token invalid');
                instagramService.setAccessToken(null);
                ipCookie.remove('access_token');
                ipCookie('attemptedRoute', $location.search() , { expires: 1 });
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
            getData = function () {
                var next_max_id = ($scope.media[user.id].pagination.next_max_id) ? $scope.media[user.id].pagination.next_max_id : null;
                instagramService.getUserMedia(user.id, next_max_id)
                    .then(function ( result ) {

                        if(result.data) {
                            media = media.concat(filterLikedMedia(result.data));
                        }

                        if(result.pagination) {
                            $scope.media[user.id].pagination = result.pagination;
                        }

                        if(media.length < imagesPerPage && result.pagination && result.pagination.next_max_id) {
                            getData();
                        } else {
                            $log.debug('found %s images for %s', media.length, user.username);

                            if(!result.pagination.next_max_id) {
                                $log.debug('found all 0 likes for %s', user.username);
                                $scope.media[user.id].pagination = false;
                            }

                            $scope.media[user.id].data = $scope.media[user.id].data.concat(media);
                            deferred.resolve(media);
                        }
                    },
                    function ( result ) {
                        deferred.reject( result );
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
                        $log.debug('found %s images for %s', filterLikedMedia(result.data).length, $scope.following[$scope.followingToken].username);
                        if(!result.pagination.next_max_id) {
                            $log.debug('found all 0 likes for %s', $scope.following[$scope.followingToken].username);
                            //$scope.following.splice($scope.followingToken, 1);
                            $scope.media[followerId].pagination = false;
                        } else {
                            $scope.media[followerId].pagination = result.pagination;
                        }
                        $scope.media[followerId].data = $scope.media[followerId].data.concat(filterLikedMedia(result.data));
                        media = media.concat(filterLikedMedia(result.data));
                        $scope.followingToken = ($scope.followingToken + 1) % $scope.following.length;
                        if (media.length < imagesPerPage && $scope.following.length > 0) {
                            getNextPage();
                        } else {
                            deferred.resolve(media);
                        }
                    },
                    function () {
                        falseCount++;
                        //$scope.following.splice($scope.followingToken, 1);
                        $scope.followingToken = ($scope.followingToken + 1 ) % $scope.following.length;
                        if ($scope.following.length > falseCount) {
                            getNextPage();
                        } else {
                            $log.debug('found all 0 likes for followers');
                            if (media.length > 0) {
                                deferred.resolve(media);
                            } else {
                                deferred.reject();
                            }
                        }
                    });
            };

        if ($scope.following.length > 0) {
            getNextPage();
        } else {
            deferred.reject();
        }

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
                        $log.debug('found %s images for %s', filterLikedMedia(result.data).length, worldCoordinates[worldToken].join());
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
                        getNextPage();
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
                    fisherYates(following); //randomize
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

                    if ($scope.view.self.length === 0) {
                        setErrorMessage('You should be happy!', 'All of your photos have at least 1 like!');
                        $scope.toggleView('showError', true);
                    }

                    $scope.complete['self'] = true;
                    $scope.busy['self'] = false;
                });
        } else if ($scope.type === 'friends') {
            $scope.busy['friends'] = true;

            getFollowingList()
                .then(function () {
                    getFollowerPage()
                        .then(function (media) {
                            $scope.view.friends = $scope.view.friends.concat(media);
                            $log.debug('follower page', media);
                            $scope.busy['friends'] = false;
                        }, function () {
                            if ($scope.view.friends.length === 0) {
                                setErrorMessage('Wow!', 'You have popular friends! All their photos are liked.');
                                $scope.toggleView('showError', true);
                            }

                            $scope.complete['friends'] = true;
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
                    $log.debug('world page', media);
                    $scope.busy['world'] = false;
                });
        } else if ( $scope.type === 'search' ) {
            if (!$scope.searchUser) { return; }
            $scope.busy['search'] = true;
            $scope.toggleView('showError', false);

            if ($scope.media[$scope.searchUser.id].data.length > 0 && $scope.view.search.length === 0) {
                $scope.view.search = $scope.media[$scope.searchUser.id].data;
            }

            $scope.getUserMedia($scope.searchUser)
                .then(function (media) {
                    $scope.view.search = $scope.view.search.concat(media);
                    $log.debug('search page', media);
                    $scope.busy['search'] = false;
                },
                function ( result ) {
                    if ( result && result.meta.code === 400 ) {
                        setErrorMessage('Yikes!', 'This person has a protected profile.');
                        $scope.toggleView('showError', true);
                    } else {
                        if ($scope.view.search === 0) {
                            setErrorMessage('Instagram Pro!', 'All of '+$scope.searchUser+'\'s photos have at least 1 like!');
                            $scope.toggleView('showError', true);
                        }

                        $scope.complete['search'] = true;
                    }

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
        $scope.showError = false;
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
        $scope.complete = {
            world: false,
            friends: false,
            self: false,
            search: false
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
