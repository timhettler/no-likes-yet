angular.module('app')
.directive('checkUser', function ($rootScope, $location, $log, instagramService, ipCookie) {
    return {
        link: function (scope, elem, attrs, ctrl) {
            $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
                if (instagramService.hasAccessToken()) {
                    $log.debug('has access token');
                    // if (currRoute.templateUrl === "partials/splash.html") {
                    //     $location.url('/media/?type=world', true);
                    //     return;
                    // }
                }

                if(ipCookie('access_token')) {
                    $log.debug('cookie found', ipCookie('access_token'));
                    instagramService.setAccessToken(ipCookie('access_token'));
                    // if (currRoute.templateUrl === "partials/splash.html") {
                    //     $location.url('/media/?type=world', true);
                    //     return;
                    // }
                    return;
                }

                if (currRoute.requiresAuth) {
                    $log.debug('route requires auth, redirecting');
                    ipCookie('attemptedRoute', currRoute.params , { expires: 1 });
                    $location.url('/', true);
                    return;
                }
            });
        }
    };
});
