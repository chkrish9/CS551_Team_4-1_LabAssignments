const mapsApp = angular.module("mapsApp", []);

mapsApp.controller("mapsCtrl", ["$scope", "$http", function ($scope, $http) {
    "use strict";
    /*
    * This method will call on controller load.
    */
    $scope.init = function () {
        if (localStorage.getItem("loggedInUser") !== null) {
            $scope.user = JSON.parse(localStorage.getItem("loggedInUser"));
            $scope.displayName = $scope.user.name;
        }
        else {
            location.href = "../index.html";
        }

        $scope.mapsInit();
    };

    /*
    * This method will initialize the maps and place the marker in kansas city.
    */
    $scope.mapsInit = function () {
        var options = {
            center: new google.maps.LatLng(39.0997, -94.5786),
            zoom: 13
        };
        $scope.map = new google.maps.Map(
            document.getElementById("map"), options
        );
        $scope.addMarker({"lat": 39.0997, "lng": -94.5786});
    };

    /*
    * This method will get the coordinate details for the entered location.
    */
    $scope.searchPlace = function () {
        $http({
            method: "GET",
            url: "http://www.mapquestapi.com/geocoding/v1/address?key=T9f59YJ6D2npC0AGMg1kRBl7hcR5Jnly&location=" + $scope.place
        }).then(function successCallback(response) {
            console.log(response);
            var location = response.data.results[0].locations[0].displayLatLng;
            $scope.displayData = {
                "searchedPlace": $scope.place,
                "latitude": location.lat,
                "longitude": location.lng
            };
            angular.element("#displayData").removeClass("hidden");
            $scope.addMarker({"lat": location.lat, "lng": location.lng});
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    /*
    * This method will add marker to the passed location coordinators.
    */
    $scope.addMarker = function (res) {
        if ($scope.marker) {
            $scope.marker.setMap(null);
        }
        $scope.marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(res.lat, res.lng),
            animation: google.maps.Animation.DROP,
            zoom: 13
        });
        $scope.map.setCenter(new google.maps.LatLng(res.lat, res.lng));
    };

    /*
    * This method will call when the user clicks on logout.
    * It will remove the key from local storage.
    */
    $scope.logout = function () {
        localStorage.removeItem("loggedInUser");
        location.href = "../index.html";
    };

    /*
    * Calling the init method.
    * This will call mapsInit method which will initialize the maps.
    */
    $scope.init();
}]);