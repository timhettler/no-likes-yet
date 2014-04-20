var app = angular.module('app');

var MainCtrl = app.controller('MainCtrl', function ($scope, $location, ipCookie, instagramApiData, instagramService) {
    $scope.clientId = instagramApiData.clientId;
    $scope.redirectUri = instagramApiData.redirectUri;

    console.log(ipCookie('access_token'), instagramApiData.hasAccessToken);

    if(ipCookie('access_token') || instagramApiData.hasAccessToken) {
        console.log('cookie found', ipCookie('access_token'));
        instagramService.setAccessToken(ipCookie('access_token'));

        instagramService.getSelfData()
            .then(function (user) {
                ipCookie('self', user , { expires: 30 });
                $scope.hasAccessToken = true;
                $location.replace().url('/user/'+user.username);
            },
            function (meta) {
                ipCookie.remove('access_token');
                $scope.hasAccessToken = false;
            });
    }

});
