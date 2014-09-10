(function ( window, document, undefined ) {
'use strict';

var app = angular.module('app');

/* Services */

app.factory('instagramService', function ($http, $q, $log, instagramApiData) {
    var publicMethods = {},
        clientId = instagramApiData.clientId,
        accessToken = null,
        baseUrl = 'https://api.instagram.com/v1/',
        users = {},
        media = {};

    var getData = function (url) {
        var deferred = $q.defer();

        $log.debug('api request: ', url);

        $http.
            jsonp(url).
                success(function(response, status, headers, config) {
                    deferred.resolve(response);
                }).
                error(function(response, status, headers, config) {
                    deferred.reject(response);
                });

        return deferred.promise;
    };

    var configureUrl = function (url, params) {
        var query = [(accessToken) ? 'access_token='+accessToken : 'client_id=' + clientId, 'callback=JSON_CALLBACK'];

        angular.forEach(params, function (value, key) {
            if(value) { this.push(key + '=' + value); }
        }, query);

        return url + '?' + query.join('&');
    };

    publicMethods.getSelfData = function () {
        var deferred = $q.defer(),
            url = configureUrl('https://api.instagram.com/v1/users/self/');

        getData(url)
            .then(function (result) {
                if(result.data) {
                    setUserData(result.data);
                    deferred.resolve(result.data);
                } else {
                    deferred.reject(result);
                }
            });

        return deferred.promise;
    };

    publicMethods.getUserData = function (username) {
        var deferred = $q.defer();

        if(users[username]) {
            deferred.resolve(users[username]);
        } else {
            return searchForUser(username);
        }

        return deferred.promise;
    };

    var setUserData = function (userObj) {
        users[userObj.username] = userObj;
        return users[userObj.username];
    };

    publicMethods.getUserMedia = function (uid, max_id) {
        var deferred = $q.defer(),
            mediaUrl = configureUrl(baseUrl + 'users/' + uid + '/media/recent/', {'max_id':max_id});

            getData(mediaUrl)
                .then(function (result) {
                    if ( result.meta.code === 200 ) {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(result);
                    }
                });

        return deferred.promise;
    };

    publicMethods.getWorldMedia = function (coords, max_timestamp) {
        var deferred = $q.defer(),
            mediaUrl = configureUrl(baseUrl + 'media/search/', {'lat':coords[0],'lng':coords[1],'max_timestamp':max_timestamp,'distance':5000});

            getData(mediaUrl)
                .then(function (result) {
                    deferred.resolve(result);
                });

        return deferred.promise;
    };

    publicMethods.getUserFollowing = function (uid) {
        var deferred = $q.defer(),
            followingUrl = configureUrl(baseUrl + 'users/' + uid + '/follows/'),
            following = [],
            getFollowing = function (url) {
                $log.debug('getting followers at %s', url);
                getData(url)
                    .then(function (result) {
                        following = following.concat(result.data);

                        result.data.forEach(function (user) { // Store user data incase we want to look them up later
                            setUserData(user);
                        });

                        if(result.pagination.next_url) {
                            getFollowing(configureUrl(baseUrl + 'users/' + uid + '/follows/', {cursor:result.pagination.next_cursor}));
                        } else {
                            deferred.resolve(following);
                        }
                    });
            };

            getFollowing(followingUrl);

        return deferred.promise;
    };

    var searchForUser = function (username) {
        var deferred = $q.defer(),
            url = configureUrl('https://api.instagram.com/v1/users/search/',{q:username});

        getData(url)
            .then(function (users) {
                users.data.forEach(function (user) {
                    if ( user.username === username ) {
                        setUserData(user);
                        deferred.resolve(user);
                        return;
                    }
                });

                deferred.reject(users);
            });

        return deferred.promise;
    };

    publicMethods.setAccessToken = function (token) {
        $log.debug('access token set', token);
        accessToken = token;
    };

    publicMethods.hasAccessToken = function () {
        return accessToken !== null;
    };

    publicMethods.setLike = function (mediaId) {
        var deferred = $q.defer();

        $http.
            post(
                'https://api.instagram.com/v1/media/'+mediaId+'/likes?access_token='+accessToken
            ).
            success(function(response, status, headers, config) {
                deferred.resolve(response);
            }).
            error(function(response, status, headers, config) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    return publicMethods;
    });


})( window, document );
