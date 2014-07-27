var app = angular.module('app', ['ngRoute', 'ivpusic.cookie', 'templates-app', 'infinite-scroll']);

// app.config(['$httpProvider', function($httpProvider) {
//         $httpProvider.defaults.useXDomain = true;
//         delete $httpProvider.defaults.headers.common['X-Requested-With'];
//     }
// ]);

app.constant('instagramApiData', (function () {
    if (location.host.indexOf("local") === -1) {
        return {
            clientId: '248c3275e45d465db7fe8f1e246cd60d',
            grant_type: 'authorization_code',
            redirectUri: 'http://timhettler.com/nly/',
            scope: 'basic+likes'
        };
    } else {
        return {
            clientId: 'ed254d50500045dd81f073465e10a777',
            grant_type: 'authorization_code',
            redirectUri: 'http://localhost/freelance/no-likes-yet/build/',
            scope: 'basic+likes'
        };
    }
})());


