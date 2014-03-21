var app = angular.module('app');

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/dashboard.html',
            controller: 'DashboardCtrl'
        })
        .otherwise({ redirectTo: '/' });
}]);
