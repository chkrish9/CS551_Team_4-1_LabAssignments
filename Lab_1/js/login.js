var loginapp = angular.module("loginApp", []);

loginapp.controller("loginCtrl", ["$scope", function ($scope) {
        $scope.load = function () {
            console.log("hi");
        }
}]);