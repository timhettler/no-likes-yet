var app = angular.module('app');

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/user/:username', {
            templateUrl: 'partials/media.html',
            controller: 'MediaCtrl'
        })
        .otherwise({ redirectTo: '/' });
}]);
