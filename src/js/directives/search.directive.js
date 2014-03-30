angular.module('app')
.directive('search', function ($location, instagramService) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/search.tpl.html',
        scope: true,
        controller: function($scope, $location, instagramService) {

            $scope.query = function() {
                console.log('searching for user %s...', $scope.term);
                instagramService.searchForUser($scope.term)
                    .then(function (result) {
                        $location.url('/user/'+result.username);
                    },
                    function () {
                        //TODO: User not found
                    });
            };
        },
        link: function(scope, element, attrs, controller) {

        }
    };
});
