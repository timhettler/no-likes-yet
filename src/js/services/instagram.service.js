(function ( window, document, undefined ) {
'use strict';

var app = angular.module('app');

/* Services */

app.factory('instagramService', function ($http, $q) {
    var publicMethods = {},
        clientId = 'ed254d50500045dd81f073465e10a777',
        baseUrl = 'https://api.instagram.com/v1/',
        users = {};

    var getData = function (url) {
        var deferred = $q.defer();

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

    publicMethods.getUserData = function (username) {
        return users[username];
    };

    var setUserData = function (userObj) {
        users[userObj.username] = userObj;
        return users[userObj.username];
    };

    publicMethods.getUserImages = function (uid) {
        var deferred = $q.defer(),
            mediaUrl = baseUrl + 'users/' + uid + '/media/recent/?client_id=' + clientId + '&callback=JSON_CALLBACK',
            images = [],
            getImages = function (url) {
                console.log('getting images at %s', url);
                getData(url)
                    .then(function (result) {
                        images = images.concat(result.data);

                        if(result.pagination.next_max_id) {
                            getImages(mediaUrl + '&max_id=' + result.pagination.next_max_id);
                        } else {
                            deferred.resolve(images);
                        }
                    });
            };

            getImages(mediaUrl);

        return deferred.promise;
    };

    publicMethods.getNoLikes = function (uid) {
        var deferred = $q.defer(),
            lonelyMedia = [],
            filterLikedMedia = function (media) {
                media.forEach(function (item) {
                    if (item.likes.count === 0) {
                        lonelyMedia.push(item);
                    }
                });
                deferred.resolve(lonelyMedia);
            };

        publicMethods.getUserImages(uid)
            .then(filterLikedMedia);

        return deferred.promise;
    };

    publicMethods.searchForUser = function (username) {
        var deferred = $q.defer(),
            url = 'https://api.instagram.com/v1/users/search/?q=' + username + '&client_id=' + clientId + '&callback=JSON_CALLBACK';

        getData(url)
            .then(function (users) {
                if (users.data.length === 1) {
                    setUserData(users.data[0]);
                    deferred.resolve(users.data[0]);
                } else {
                    deferred.reject(users);
                }
            });

        return deferred.promise;
    };

    return publicMethods;
});


})( window, document );
