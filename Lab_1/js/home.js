const homeApp = angular.module("homeApp", []);

homeApp.controller("homeCtrl", ["$scope", "$http", function ($scope, $http) {
    $scope.result = {};
    $scope.displayName="";
    $scope.init = function () {
        if (localStorage.getItem("loggedInUser") !== null) {
            $scope.user = JSON.parse(localStorage.getItem("loggedInUser"));
            $scope.displayName = $scope.user.name;
        }
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
            $scope.result["name"] = response.data.itemListElement[0].result.name;
            $scope.result["description"] = response.data.itemListElement[0].result.description;
            $scope.result["url"] = response.data.itemListElement[0].result.url;
            $scope.result["article"] = response.data.itemListElement[0].result.detailedDescription.articleBody;
        }, function errorCallback(response) {
            console.log(response);
        });
    }

    $scope.imageUpload = function (files) {
        var file = files.files[0];

        var img = document.getElementById("profilePic");
        img.file = file;
        // Using FileReader to display the image content
        var reader = new FileReader();
        reader.onload = (function (aImg) {
            return function (e) {
                aImg.src = e.target.result;
                let users = JSON.parse(localStorage.getItem("users"));
                users.forEach(function (el) {
                    if(el.email == $scope.user.email)
                    {
                        el.img = e.target.result;
                    }
                });
                localStorage.setItem("users", JSON.stringify(users));
            };
        })(img);
        reader.readAsDataURL(file);
    }

    $scope.edit = function(event){
        angular.element(event.currentTarget).parents("tr").find(".edit").addClass("hidden")
        angular.element(event.currentTarget).parents("tr").find(".update").removeClass("hidden")
    }
    $scope.updateUser = function(event){
        angular.element(event.currentTarget).parents("tr").find(".edit").removeClass("hidden");
        angular.element(event.currentTarget).parents("tr").find(".update").addClass("hidden");
        let users = JSON.parse(localStorage.getItem("users"));
        users.forEach(function (el) {
            if(el.email == $scope.user.email)
            {
                el.name = $scope.user.name;
                el.password = $scope.user.password;
                el.img = $scope.user.img;
            }
        });
        localStorage.setItem("users", JSON.stringify(users));
    }
    $scope.init();
}]);