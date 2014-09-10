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
            redirectUri: 'http://www.nolikesyet.com/',
            scope: 'basic+likes'
        };
    } else {
        return {
            clientId: 'ed254d50500045dd81f073465e10a777',
            grant_type: 'authorization_code',
            redirectUri: 'http://localhost/no-likes-yet/bin/',
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
            [40.7216,-73.952429], // Greenpoint, Brooklyn
            [53.349001, -6.266327], // Dublin, Ireland
            [54.154867, -4.485769], // Douglas, Isle of Man
            [54.598494, -5.92515], // Belfast, Northern Ireland
            [57.152444, -2.098389], // Auberdeen, Scotland
            [55.861029, -4.249563], // Glasgow, Scotland
            [39.961176, -82.998794], // Columbus, OH
            [40.440625, -79.995886], // Pittsburgh, PA
            [39.952335, -75.163789], // Philadelphia, PA
            [42.443961, -76.501881], // Ithaca, NY
            [43.16103, -77.610922], // Rochester, NY
            [40.712784, -74.005941], // FiDi, NYC
            [40.586725, -73.811499], // Rockaway Beach, Queens
            [40.706446, -73.953616], // Williamsburg, Brooklyn
            [40.694428, -73.921286], // Bushwick, Brooklyn
            [40.660204, -73.968956], // Prospect Park, Brooklyn
            [40.759011, -73.984472], // Times Square, NYC
            [33.748995, -84.387982], // Atlanta, GA
            [30.421309, -87.216915], // Pensacola, FL
            [29.951066, -90.071532], // New Orleans, LA
            [23.05407, -82.345189], // Havana, Cuba
            [42.886447, -78.878369], // Buffalo, NY
            [-33.924868, 18.424055], // Cape Town, South Africa
            [-33.867487, 151.20699], // Sydney, Australia
            [-27.471011, 153.023449], // Brisbane, Australia
            [-31.953004, 115.857469], // Perth, Australia
            [35.179554, 129.075642], // Busan, South Korea
            [59.329323, 18.068581], // Stockholm, Sweden
            [47.497912, 19.040235], // Budapest, Hungary
            [32.0853, 34.781768], // Tel Aviv,Israel
            [25.047664, 55.181741], // Dubai, UAE
            [43.073052, -89.40123], // Madison, WI
            [32.833461, -96.791945], // Highland Park, TX
            [32.715738, -117.161084], // San Diego, CA
            [40.744679, -73.948542] // LIC, Queens
        ];
});

app.constant('CTA', [
    'Be the first like.',
    '#click #to #like #this #photo',
    'One like would make their day.',
    'Like me :(',
    'Yikes.',
    'Nobody will know you liked this.',
    'Your one like is worth a million.',
    'Just imagine a better filter.',
    'Let\'s end this embarrassment.',
    'Help this poor photo.',
    'Not all instagrams are perfect.',
    'One small like for you&hellip;',
    'One big like for mankind.',
    'Could this be like at first sight.',
    'You likey?',
    'What\'s one like for you?',
    'It must be the caption.',
    'It might not be a beautiful sunset.'
]);
