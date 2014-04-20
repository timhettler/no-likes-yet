(function ( window, document, undefined ) {
'use strict';

var app = angular.module('app');

/* Services */

app.factory('instagramService', function ($http, $q, instagramApiData) {
    var publicMethods = {},
        clientId = instagramApiData.clientId,
        accessToken = null,
        baseUrl = 'https://api.instagram.com/v1/',
        users = {},
        media = {};

    var getData = function (url) {
        var deferred = $q.defer();

        console.log('api request: ', url);

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
        return users[username];
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
                    deferred.resolve(result);
                });

        return deferred.promise;
    };

    publicMethods.getUserFollowing = function (uid) {
        var deferred = $q.defer(),
            followingUrl = configureUrl(baseUrl + 'users/' + uid + '/follows/'),
            following = [],
            getFollowing = function (url) {
                console.log('getting followers at %s', url);
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

    publicMethods.searchForUser = function (username) {
        var deferred = $q.defer(),
            url = configureUrl('https://api.instagram.com/v1/users/search/',{q:username});

        getData(url)
            .then(function (users) {
                if (users.data.length !== 0) {
                    setUserData(users.data[0]);
                    deferred.resolve(users.data[0]);
                } else {
                    deferred.reject(users);
                }
            });

        return deferred.promise;
    };

    publicMethods.setAccessToken = function (token) {
        console.log('access token set', token);
        accessToken = token;
    };

    publicMethods.hasAccessToken = function () {
        return accessToken !== null;
    };

    return publicMethods;
    });


})( window, document );
