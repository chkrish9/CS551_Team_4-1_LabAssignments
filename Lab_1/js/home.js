const homeApp = angular.module("homeApp", []);

homeApp.controller("homeCtrl", ["$scope", function ($scope) {
    $scope.init = function () {
        if (localStorage.getItem("loggedInUser") !== null)
            $scope.user = JSON.parse(localStorage.getItem("loggedInUser"))[0];
        else
            location.href="../index.html";
    }

    $scope.logout = function()
    {
        localStorage.removeItem("loggedInUser")
        location.href = "../index.html";
    }
    $scope.init();
}]);