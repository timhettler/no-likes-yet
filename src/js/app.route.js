var app = angular.module('app');

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/splash.html',
            controller: 'SplashCtrl',
            requiresAuth: false
        })
        .when('/media/', {
            templateUrl: 'partials/media.html',
            controller: 'MediaCtrl',
            reloadOnSearch: false,
            requiresAuth: true
        })
        .when('/access_token=:access_token', {
            templateUrl: 'partials/auth.html',
            controller: 'AuthCtrl',
            requiresAuth: false
        })
        .otherwise({ redirectTo: '/' });
}]);
