angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/guidelineList.html',
      controller: 'GuidelineListController'
    });

  $locationProvider.html5Mode(true);
}]);
