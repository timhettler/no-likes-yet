var app = angular.module('app', ['ngRoute', 'ivpusic.cookie', 'templates-app']);

app.constant('instagramApiData', {
    clientId: '248c3275e45d465db7fe8f1e246cd60d',
    grant_type: 'authorization_code',
    redirectUri: 'http://timhettler.com/nly/'
});
