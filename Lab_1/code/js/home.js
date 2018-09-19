const homeApp = angular.module("homeApp", []);
homeApp.controller("homeCtrl", ["$scope", "$http", function ($scope, $http) {
    "use strict";
    $scope.result = {};
    $scope.displayName = "";
    /*
    * This method will call on controller load which will check weather the user logged in or not.
    */
    $scope.init = function () {
        if (localStorage.getItem("loggedInUser") !== null) {
            $scope.user = JSON.parse(localStorage.getItem("loggedInUser"));
            $scope.displayName = $scope.user.name;
        }
        else {
            location.href = "../index.html";
        }
    };

    /*
    * This method will call when the user clicks on logout.
    * In this method we are removing the key from local storage.
    */
    $scope.logout = function () {
        localStorage.removeItem("loggedInUser");
        location.href = "../index.html";
    };

    /*
    * This method will call when the user clicks on the search button in home page.
    * This will make a request to google knowledge graph and get the results.
    */
    $scope.find = function () {
        $http({
            method: "GET",
            url: "https://kgsearch.googleapis.com/v1/entities:search?query=" + $scope.search + "&key=AIzaSyA9CvHV75OZgADhnju2DkS73y_3QS1Gsxo&limit=1&indent=True"
        }).then(function successCallback(response) {
            if (response.data.itemListElement.length > 0) {
                $scope.result = {
                    "name": "",
                    "description": "",
                    "url": "",
                    "article": "",
                    "image": "../images/default-user.png"
                };
                angular.element("#result").removeClass("hidden");
                angular.element("#errorMsg").addClass("hidden");
                $scope.result.name = response.data.itemListElement[0].result.name;
                $scope.result.description = response.data.itemListElement[0].result.description;
                $scope.result.url = response.data.itemListElement[0].result.url;
                $scope.result.article = response.data.itemListElement[0].result.detailedDescription.articleBody;
                if (response.data.itemListElement[0].result.image !== undefined) {
                    $scope.result.image = response.data.itemListElement[0].result.image.contentUrl;
                }
            }
            else {
                angular.element("#errorMsg").removeClass("hidden");
                angular.element("#result").addClass("hidden");
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    /*
    * This method will call when the user tries to upload the profile picture in user details page.
    */
    $scope.imageUpload = function (files) {
        var file = files.files[0];

        var img = document.getElementById("profilePic");
        img.file = file;
        // Using FileReader to display the image content
        var reader = new FileReader();
        reader.onload = $scope.readImg(img);
        reader.readAsDataURL(file);
    };

    /*
    * This will call in image upload method.
    */
    $scope.readImg = function (aImg) {
        return function (e) {
            aImg.src = e.target.result;
            var users = JSON.parse(localStorage.getItem("users"));
            users.forEach(function (el) {
                if (el.email === $scope.user.email) {
                    el.img = e.target.result;
                }
            });
            localStorage.setItem("users", JSON.stringify(users));
        };
    };

    /*
    * This method will call when the user clicks on edit button in user details page.
    */
    $scope.edit = function (event) {
        angular.element(event.currentTarget).parents("tr").find(".edit").addClass("hidden");
        angular.element(event.currentTarget).parents("tr").find(".update").removeClass("hidden");
    };

    /*
    * This method will call when the user clicks on update button in user details page.
    */
    $scope.updateUser = function (event) {
        angular.element(event.currentTarget).parents("tr").find(".edit").removeClass("hidden");
        angular.element(event.currentTarget).parents("tr").find(".update").addClass("hidden");
        var users = JSON.parse(localStorage.getItem("users"));
        users.forEach(function (el) {
            if (el.email === $scope.user.email) {
                el.name = $scope.user.name;
                el.password = $scope.user.password;
                el.img = $scope.user.img;
            }
        });
        localStorage.setItem("users", JSON.stringify(users));
    };

    /*
    * Calling the init method.
    */
    $scope.init();
}]);