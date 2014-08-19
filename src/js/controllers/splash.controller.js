var app = angular.module('app');

var SplashCtrl = app.controller('SplashCtrl', function ($scope, instagramApiData, instagramService) {
    $scope.instagramApiData = instagramApiData;
    $scope.hasAccessToken = instagramService.hasAccessToken();
});
