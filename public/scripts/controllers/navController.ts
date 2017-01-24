angular.module('msApp').controller('NavController', ['$scope', '$window', 'AuthFactory', ($scope, $window, AuthFactory) => {
    console.log('Nav controller load');
    $scope.loggedIn = false;
    AuthFactory.isLoggedIn()
    .then((result: ng.IHttpPromiseCallbackArg<Object>) => {
        if(result.status === 200) {
            $scope.loggedIn = true;
        }
    })
    .catch((err: ng.IHttpPromiseCallbackArg<Object>) => console.log(err));

    $scope.logout = () => {
        AuthFactory.logout()
            .then(() => {
                $scope.loggedIn = false;
                $window.location.href='/';
            });
    };
}]);
