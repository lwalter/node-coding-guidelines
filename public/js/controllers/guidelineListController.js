angular.module('GuidelineListController', []).controller('GuidelineListController', function ($scope, GuidelineService) {
  $scope.title = 'Guidelines';

  GuidelineService.get()
    .then(function (data) {
      $scope.guidelineList = data;
    })
    .catch(function (error) {
      console.log(error);
    });
});
