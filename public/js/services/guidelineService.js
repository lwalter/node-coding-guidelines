angular.module('GuidelineService', []).factory('GuidelineService', ['$http', function ($http) {
  return {
    get: function () {
      return $http.get('/api/guidelines')
        .then(function (result) {
          return result.data;
        })
        .catch(function (error) {
          console.log("ERROR");
          return {};
        });
    },

    create: function (guidelineData) {
      return $http.post('/api/guidelines', guidelineData);
    },

    delete: function (id) {
      return $http.delete('/api/guidelines/' + id);
    }
  }
}]);
