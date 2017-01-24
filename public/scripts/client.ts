/// <reference path="../../node_modules/@types/angular/index.d.ts" />
/// <reference path="../../node_modules/@types/angular-route/index.d.ts" />
/// @types {angular.Module}

var msApp = angular.module('msApp', ['ngRoute']);

msApp.config(['$routeProvider', ($routeProvider: angular.route.IRouteProvider) => {
    $routeProvider
        .when('/login', {
            templateUrl: 'views/partials/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'views/partials/register.html',
            controller: 'RegisterController'
        })
        .when('/dashboard', {
            templateUrl: 'views/partials/dashboard.html',
            controller: 'DashboardController'
        })
        .when('/profile', {
            templateUrl: 'views/partials/profile.html',
            controller: 'ProfileController'
        })
        .otherwise({
            redirectTo: 'dashboard'
        });
}]);
