var app = angular.module('app');

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/user/:username', {
            templateUrl: 'partials/media.html',
            controller: 'MediaCtrl'
        })
        .when('/access_token=:access_token', {
            templateUrl: 'partials/auth.html',
            controller: 'AuthCtrl'
        })
        .otherwise({ redirectTo: '/' });
}]);
