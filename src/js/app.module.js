var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ivpusic.cookie', 'templates-app', 'infinite-scroll']);

// app.config(['$httpProvider', function($httpProvider) {
//         $httpProvider.defaults.useXDomain = true;
//         delete $httpProvider.defaults.headers.common['X-Requested-With'];
//     }
// ]);

app.constant('instagramApiData', (function () {
    if (location.host.indexOf("localhost") === -1) {
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

app.constant('WORLD_COORDS', function () {
    return [
            [40.781256, -73.966441], // Central Park, NYC
            [43.518556, -73.67054], // Lake George, NY
            [42.457407, -2.449265], // Logroño, Spain
            [43.117275, -76.248722], // Long Branch Park, NY
            [35.245619, -101.821289], // Amarillo, TX
            [61.227957, -149.897461], // Anchorage, AK
            [45.521744, -122.67334], // Portland, OR
            [-34.599722, -58.381944], // Buenos Aires, AR
            [-41.47566, -72.949219], // Puerto Montt, Chile
            [28.3727123, -81.54593], // Epcot Center, FL
            [38.68551, -96.503906], // Council Grove, KS
            [41.7898354, -69.9897323], // Cape Cod, MA
            [30.24011, -97.712166], // Austin, TX
            [67.855856, 20.225294], // Kiruna, Sweden
            [48.8566667, 2.3509871], // Paris, France
            [40.0149856, -105.2705456], // Boulder, CO
            [43.2504393, -5.9832577], // Proaza, Spain
            [41.512995, 14.063514], // Pozzilli, Italy
            [40.65,-73.95], // Prospect Heights, Brooklyn
            [33.8575,-117.87556], // Placentia, CA
            [39.1910983,-106.8175387], // Aspen, CO
            [42.3584308,-71.0597732], // Boston, MA
            [41.850033,-87.6500523], // Chicago, IL
            [34.0522342,-118.2436849], // Los Angeles, CA
            [37.7749295,-122.4194155], // San Francisco, CA
            [35.6894875,139.6917064], // Tokyo, Japan
            [37.566535,126.9779692], // Seoul, South Korea
            [59.939039,30.315785], // St Petersburg, Russia
            [43.234782,-76.224604], // Pleasant Lake, NY
            [43.036227,-76.136456], // Syracuse, NY
            [13.7234186,100.4762319], // Bangkok, Thailand
            [39.904667,116.408198], // Beijing, China
            [4.609866,-74.08205], // Bogotá, Colombia
            [30.064742,31.249509], // Cairo, Egypt
            [28.635308,77.22496], // New Delhi, India
            [23.709921,90.407143], // Dhaka, Bangladesh
            [23.129075,113.264423], // Guangzhou, China
            [41.012379,28.975926], // Istanbul, Turkey
            [-6.211544,106.845172], // Jakarta, Indonesia
            [24.893379,67.028061], // Karachi, Pakistan
            [22.572646,88.363895], // Kolkata, India
            [6.441158,3.417977], // Lagos, Nigeria
            [51.5001524,-0.1262362], // London, UK
            [14.6010326,120.9761599], // Manila, Philippines
            [19.4270499,-99.1275711], // Mexico City, Mexico
            [55.755786,37.617633], // Moscow, Russia
            [19.017656,72.856178], // Mumbai, India
            [34.6937378,135.5021651], // Osaka, Japan
            [-22.9035393,-43.2095869], // Rio de Janeiro, Brazil
            [-23.5489433,-46.6388182], // São Paulo,Brazil
            [31.230708,121.472916], // Shanghai, China
            [39.120876,117.21503], // Tianjin, China
            [43.670233,-79.386755], // Toronto, CA
            [45.545447,-73.639076], // Montreal, CA
            [51.055149,-114.062438], // Calgary, CA
            [51.770615,-1.25507], // Oxford, UK
            [40.7216,-73.952429] // Greenpoint, Brooklyn
        ];
});

app.constant('CTA', [
    'Be the first like.',
    'Doesn’t this deserve a like?',
    'One like would make his day.',
    'Like me :(',
    'You don’t like the composition?',
    'Such a likable filter.',
    'You likey likey?',
    'Isn’t this likeable?',
    'Most likely to get a like.',
    'Isn’t this worth a like?',
    'Make someone\'s day and like this photo.',
    'Almost there&hellip; now just click.',
    'Nobody will know you liked this. ',
    'What\'s one like for you? ',
    'Your one like is worth a million.'
]);
