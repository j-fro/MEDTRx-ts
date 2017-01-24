angular.module('msApp').controller('LoginController', ['$scope', '$http', '$window', ($scope, $http, $window) => {
    console.log('login');
    $scope.login = function() {
        console.log('logging in');
        var toSend = {
            username: $scope.emailIn,
            password: $scope.passwordIn
        };
        $http.post('/login', toSend)
        .then((result: ng.IHttpPromiseCallbackArg<Object>) => {
            console.log('Success:', result);
            $window.location.href = '/';
        })
        .catch((err: ng.IHttpPromiseCallbackArg<Object>) => console.log(err));
    };
}]);
