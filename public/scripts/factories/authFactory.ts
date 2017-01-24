/// <reference path="../../../node_modules/@types/angular/index.d.ts" />

angular.module('msApp').factory('AuthFactory', ($http: ng.IHttpService) => {
    var Status = {
        loggedIn: false,
    };

    // the public API
    return {
        Status: Status,

        checkLoggedIn: function() {
            return Status.loggedIn;
        },

        isLoggedIn: function() {
            return $http.get('/login');
        },

        setLoggedIn: function(value: boolean) {
            Status.loggedIn = value;
        },

        logout: function() {
            return $http.get('/login/logout');
        },
    };
});
