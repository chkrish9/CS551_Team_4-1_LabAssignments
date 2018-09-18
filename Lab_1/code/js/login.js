const loginApp = angular.module("loginApp", []);

loginApp.controller("loginCtrl", ["$scope", "$q", function ($scope, $q) {
    "use strict";
    $scope.users = JSON.parse(localStorage.getItem("users"));
    $scope.foundUser = null;
    $scope.init = function () {
        $scope.facebook("2128387634146175", "v2.7");
        $scope.google("1059492544866-qvi5a8tdcpjhki6lpc397s9a475fl9pa.apps.googleusercontent.com");
        if (localStorage.getItem("pageLoaded") !== "true") {
            $scope.loadInitialData();
        }
    };

    $scope.facebook = function (key, version) {
        var fbScript = document.createElement("script");
        var scriptTag = document.getElementsByTagName("script")[0];
        fbScript.async = true;

        fbScript.src = "//connect.facebook.net/en_US/sdk.js";

        fbScript.onload = function () {
            FB.init({
                appId: key,
                status: true,
                cookie: true,
                xfbml: true,
                version: version
            });
        };
        scriptTag.parentNode.insertBefore(fbScript, scriptTag);
    };

    $scope.google = function (key) {
        var gScript = document.createElement("script");
        var scriptTag = document.getElementsByTagName("script")[0];
        gScript.async = true;
        gScript.src = "//apis.google.com/js/platform.js";

        gScript.onload = function () {
            var params = {
                client_id: key,
                scope: "email"
            };
            gapi.load("auth2", function () {
                gapi.auth2.init(params);
            });
        };
        scriptTag.parentNode.insertBefore(gScript, scriptTag);
    };

    $scope.facebookClick = function () {
        var fetchUserDetails = function () {
            var deferred = $q.defer();
            FB.api("/me?fields=name,email,picture", function (res) {
                if (!res || res.error) {
                    deferred.reject("Error occured while fetching user details.");
                } else {
                    deferred.resolve({
                        name: res.name,
                        email: res.email,
                        uid: res.id,
                        provider: "facebook",
                        imageUrl: res.picture.data.url
                    });
                }
            });
            return deferred.promise;
        };
        FB.getLoginStatus(function (response) {
            if (response.status === "connected") {
                fetchUserDetails().then(function (userDetails) {
                    userDetails.token = response.authResponse.accessToken;
                    $scope.foundUser = $scope.users.filter(function (el) {
                        return (el.email === userDetails.email);
                    });
                    if ($scope.foundUser.length <= 0) {
                        var user = {
                            "name": userDetails.name,
                            "email": userDetails.email,
                            "password": "",
                            "img": userDetails.imageUrl,
                            "reg": "facebook",
                            "token": userDetails.token
                        };
                        localStorage.setItem("loggedInUser", JSON.stringify(user));
                        $scope.users.push(user);
                        localStorage.setItem("users", JSON.stringify($scope.users));
                    }
                    else {
                        localStorage.setItem("loggedInUser", JSON.stringify($scope.foundUser[0]));
                    }
                    location.href = "pages/home.html";
                });
            } else {
                FB.login(function (response) {
                    if (response.status === "connected") {
                        fetchUserDetails().then(function (userDetails) {
                            userDetails.token = response.authResponse.accessToken;
                            $scope.foundUser = $scope.users.filter(function (el) {
                                return (el.email === userDetails.email);
                            });
                            if ($scope.foundUser.length <= 0) {
                                var user = {
                                    "name": userDetails.name,
                                    "email": userDetails.email,
                                    "password": "",
                                    "img": userDetails.imageUrl,
                                    "reg": "facebook",
                                    "token": userDetails.token
                                };
                                localStorage.setItem("loggedInUser", JSON.stringify(user));
                                $scope.users.push(user);
                                localStorage.setItem("users", JSON.stringify($scope.users));
                            }
                            else {
                                localStorage.setItem("loggedInUser", JSON.stringify($scope.foundUser[0]));
                            }
                            location.href = "pages/home.html";
                        });
                    }
                }, {scope: "email", auth_type: "rerequest"});
            }
        });
    };

    $scope.googleClick = function () {
        var fetchUserDetails = function () {
            var currentUser = $scope.gauth.currentUser.get();
            var profile = currentUser.getBasicProfile();
            var idToken = currentUser.getAuthResponse().id_token;
            var accessToken = currentUser.getAuthResponse().access_token;
            return {
                token: accessToken,
                idToken: idToken,
                name: profile.getName(),
                email: profile.getEmail(),
                uid: profile.getId(),
                provider: "google",
                imageUrl: profile.getImageUrl()
            };
        };
        if (typeof($scope.gauth) === "undefined") {
            $scope.gauth = gapi.auth2.getAuthInstance();
        }
        if (!$scope.gauth.isSignedIn.get()) {
            $scope.gauth.signIn().then(function (googleUser) {
                var userDetails = fetchUserDetails();
                var users = JSON.parse(localStorage.getItem("users"));
                var foundUser = users.filter(function (el) {
                    return (el.email === userDetails.email);
                });
                if (foundUser.length <= 0) {
                    var user = {
                        "name": userDetails.name,
                        "email": userDetails.email,
                        "password": "",
                        "img": userDetails.imageUrl,
                        "reg": "google",
                        "token": userDetails.token
                    };

                    localStorage.setItem("loggedInUser", JSON.stringify(user));
                    users.push(user);
                    localStorage.setItem("users", JSON.stringify(users));
                }
                else {
                    localStorage.setItem("loggedInUser", JSON.stringify(foundUser[0]));
                }
                location.href = "pages/home.html";
            }, function (err) {
                console.log(err);
            });
        } else {
            var userDetails = fetchUserDetails();
            var users = JSON.parse(localStorage.getItem("users"));
            var foundUser = users.filter(function (el) {
                return (el.email === userDetails.email);
            });
            if (foundUser.length <= 0) {
                var user = {
                    "name": userDetails.name,
                    "email": userDetails.email,
                    "password": "",
                    "img": userDetails.imageUrl,
                    "reg": "google",
                    "token": userDetails.token
                };

                localStorage.setItem("loggedInUser", JSON.stringify(user));
                users.push(user);
                localStorage.setItem("users", JSON.stringify(users));
            }
            else {
                localStorage.setItem("loggedInUser", JSON.stringify(foundUser[0]));
            }
            location.href = "pages/home.html";
        }
    };

    $scope.register = function () {
        angular.element("#errorMsg").addClass("hidden").text("");
        if ($scope.user === undefined) {
            angular.element("#errorMsg").removeClass("hidden").text("Please fill all the details.");
        }
        else if ($scope.user.name === undefined || $scope.user.name === ""
            || $scope.user.email === undefined || $scope.user.email === ""
            || $scope.user.password === undefined || $scope.user.password === ""
            || $scope.cnfPassword === undefined || $scope.cnfPassword === "") {
            angular.element("#errorMsg").removeClass("hidden").text("Please fill all the details.");
        }
        else if ($scope.user.password !== $scope.cnfPassword) {
            angular.element("#errorMsg").removeClass("hidden").text("Password mismatch.");
        }
        else {
            var users = JSON.parse(localStorage.getItem("users"));
            $scope.user.img = "../images/default-user.png";
            users.push($scope.user);
            localStorage.setItem("users", JSON.stringify(users));
            location.href = "../index.html";
        }
    };

    $scope.login = function () {
        angular.element("#errorEmail").addClass("hidden").text("");
        angular.element("#errorPwd").addClass("hidden").text("");
        if ($scope.login.email === "" || $scope.login.email === undefined) {
            angular.element("#errorEmail").removeClass("hidden").text("Please enter email.");
        }
        else if ($scope.login.password === "" || $scope.login.password === undefined) {
            angular.element("#errorPwd").removeClass("hidden").text("Please enter password.");
        }
        else {
            var users = JSON.parse(localStorage.getItem("users"));
            var user = users.filter(function (el) {
                return (el.email === $scope.login.email && el.password === $scope.login.password);
            });
            if (user.length > 0) {
                localStorage.setItem("loggedInUser", JSON.stringify(user[0]));
                location.href = "pages/home.html";
            }
            else {
                angular.element("#errorPwd").removeClass("hidden").text("Invalid email/password.");
            }
        }
    };

    $scope.loadInitialData = function () {
        var users = [
            {
                "name": "Guest",
                "email": "",
                "password": "guest",
                "img": "../images/default-user.png",
                "reg": "normal",
                "token": ""
            }
        ];
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("pageLoaded", "true");
    };

    $scope.init();
}]);