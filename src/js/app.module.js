var app = angular.module('app', ['ngRoute', 'ivpusic.cookie', 'templates-app', 'infinite-scroll']);

app.constant('instagramApiData', {
    clientId: 'ed254d50500045dd81f073465e10a777',
    grant_type: 'authorization_code',
    redirectUri: 'http://localhost/freelance/no-likes-yet/build/'
});
