const loginApp = angular.module("loginApp", []);

loginApp.controller("loginCtrl", ["$scope", '$rootScope', "$q", function ($scope, $rootScope, $q) {
    $scope.init = function () {
        $scope.facebook("2128387634146175", "v2.7");
        $scope.google("1059492544866-qvi5a8tdcpjhki6lpc397s9a475fl9pa.apps.googleusercontent.com");
        if (localStorage.getItem("pageLoaded") !== "true")
            loadInitialData();
    }

    $scope.facebook = function (key, version) {
        var fbScript = document.createElement("script");
        var scriptTag = document.getElementsByTagName('script')[0];
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
        }
        scriptTag.parentNode.insertBefore(fbScript, scriptTag);
    }

    $scope.google = function (key) {
        var gScript = document.createElement("script");
        var scriptTag = document.getElementsByTagName('script')[0];
        gScript.async = true;
        gScript.src = "//apis.google.com/js/platform.js"

        gScript.onload = function () {
            var params = {
                client_id: key,
                scope: 'email'
            }
            gapi.load('auth2', function () {
                gapi.auth2.init(params);
            });
        }
        scriptTag.parentNode.insertBefore(gScript, scriptTag);
    }

    $scope.facebookClick = function () {
        var fetchUserDetails = function () {
            var deferred = $q.defer();
            FB.api('/me?fields=name,email,picture', function (res) {
                if (!res || res.error) {
                    deferred.reject('Error occured while fetching user details.');
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
        }
        FB.getLoginStatus(function (response) {
            if (response.status === "connected") {
                fetchUserDetails().then(function (userDetails) {
                    userDetails["token"] = response.authResponse.accessToken;
                    $rootScope.$broadcast('event:social-sign-in-success', userDetails);
                    localStorage.setItem("user", JSON.stringify(userDetails));
                });
            } else {
                FB.login(function (response) {
                    if (response.status === "connected") {
                        fetchUserDetails().then(function (userDetails) {
                            userDetails["token"] = response.authResponse.accessToken;
                            localStorage.setItem("user", JSON.stringify(userDetails));
                        });
                    }
                }, {scope: 'email', auth_type: 'rerequest'});
            }
        });
    }

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
            }
        }
        if (typeof($scope.gauth) == "undefined")
            $scope.gauth = gapi.auth2.getAuthInstance();
        if (!$scope.gauth.isSignedIn.get()) {
            $scope.gauth.signIn().then(function (googleUser) {
                localStorage.setItem("user", JSON.stringify(fetchUserDetails()));
            }, function (err) {
                console.log(err);
            });
        } else {
            localStorage.setItem("user", JSON.stringify(fetchUserDetails()));
        }
    }

    $scope.register = function () {
        let users = JSON.parse(localStorage.getItem("users"));
        users.push($scope.user);
        localStorage.setItem("users", JSON.stringify(users));
        location.href = "../index.html";
    }

    $scope.login = function () {
        let users = JSON.parse(localStorage.getItem("users"));
        let user = users.filter(function (el) {
            return (el.email === $scope.login.email && el.password === $scope.login.password)
        });
        if (user.length > 0) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            location.href = "pages/home.html";
        }
    }

    function loadInitialData() {
        let users = [
            {
                "name": "Guest",
                "email": "",
                "password": "guest",
            }
        ]
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("pageLoaded", "true");
    }

    $scope.init();
}]);