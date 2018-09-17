const homeApp = angular.module("homeApp", []);

homeApp.controller("homeCtrl", ["$scope", "$http", function ($scope, $http) {
    $scope.result = {};
    $scope.init = function () {
        if (localStorage.getItem("loggedInUser") !== null)
            $scope.user = JSON.parse(localStorage.getItem("loggedInUser"));
        else
            location.href = "../index.html";
    }

    $scope.logout = function () {
        localStorage.removeItem("loggedInUser")
        location.href = "../index.html";
    }

    $scope.find = function () {
        $http({
            method: 'GET',
            url: 'https://kgsearch.googleapis.com/v1/entities:search?query=' + $scope.search + '&key=AIzaSyA9CvHV75OZgADhnju2DkS73y_3QS1Gsxo&limit=1&indent=True'
        }).then(function successCallback(response) {
            console.log(response);
            $scope.result["name"]=response.data.itemListElement[0].result.name;
            $scope.result["description"]=response.data.itemListElement[0].result.description;
            $scope.result["url"]=response.data.itemListElement[0].result.url;
            $scope.result["article"]=response.data.itemListElement[0].result.detailedDescription.articleBody;
        }, function errorCallback(response) {
            console.log(response);
        });
    }
    $scope.init();
}]);