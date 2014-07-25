angular.module('app')
.directive('checkUser', function ($rootScope, $location, $log, instagramService, ipCookie) {
    return {
        link: function (scope, elem, attrs, ctrl) {
            $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
                if (instagramService.hasAccessToken()) {
                    $log.debug('has access token');
                    if (currRoute.templateUrl === "partials/splash.html") {
                        $location.url('/media/self', true);
                        return;
                    }
                }

                if(ipCookie('access_token')) {
                    $log.debug('cookie found', ipCookie('access_token'));
                    instagramService.setAccessToken(ipCookie('access_token'));
                    if (currRoute.templateUrl === "partials/splash.html") {
                        $location.url('/media/self', true);
                        return;
                    }
                    return;
                }

                if (currRoute.requiresAuth) {
                    $log.debug('route requires auth, redirecting');
                    $location.url('/', true);
                    return;
                }
            });
        }
    };
});
