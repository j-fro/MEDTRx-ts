angular.module('msApp').controller('RegisterController', ['$scope', '$http', '$window', ($scope, $http, $window) => {
    console.log('register');
    $scope.register = () => {
        console.log('registering');
        var userToSend = {
            email: $scope.emailIn,
            password: $scope.passwordIn,
            deviceId: $scope.deviceIdIn
        };
        $http.post('register/', userToSend)
        .then((response: ng.IHttpPromiseCallbackArg<Object>) => {
            console.log(response);
            if(response.status === 201) {
                $window.location.href = '/';
            }
        })
        .catch((err: ng.IHttpPromiseCallbackArg<Object>) => console.log(err));
    };
}]);
