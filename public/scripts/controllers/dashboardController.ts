interface IStatus {
    created: string
    status: boolean
}

interface IWeek {
    start: Date
    end: Date
}

angular.module('msApp').controller('DashboardController',
    ['$scope', '$http', '$window', 'AuthFactory',
    ($scope, $http, $window, AuthFactory) => {

    $scope.loggedIn = false;

    AuthFactory.isLoggedIn()
        .then(function(result: ng.IHttpPromiseCallbackArg<Object>) {
            if (result.status === 200) {
                $scope.loggedIn = true;
            }
        })
        .catch((err: ng.IHttpPromiseCallbackArg<Object>) => console.log(err));

    var today = new Date();
    var endOfWeek = today;
    endOfWeek.setDate(today.getDate() - today.getDay());
    $scope.currentWeekStart = endOfWeek;
    $scope.currentWeekEnd = new Date(today).setDate(today.getDate() + 7);

    // Holds the statuses for the week indexed 0-6
    $scope.statuses = {};

    $scope.getStatuses = function() {
        $http.get('/organizer')
            .then((result: ng.IHttpPromiseCallbackArg<Array<IStatus>>) => {
                result.data.forEach((status) => {
                    for (let i = 0; i < new Date().getDay(); i++) {
                        $scope.statuses[i] = 'remove';
                    }
                    var day = new Date(status.created).getDay();
                    $scope.statuses[day] = status.status ? 'ok' : 'remove';
                });
            })
            .catch((error: ng.IHttpPromiseCallbackArg<Object>) => {
                if (error.status === 401) {
                    $window.location.href = '#!/login';
                } else {
                    console.log(error);
                }
            });
    };

    $scope.showHistory = function(week: IWeek) {
        $http.get('/organizer/' + week.start)
            .then((result: ng.IHttpPromiseCallbackArg<Array<IStatus>>) => {
                $scope.currentWeekStart = week.start;
                $scope.currentWeekEnd = week.end;
                for (let i = 0; i < 7; i++) {
                    $scope.statuses[i] = 'remove';
                }
                result.data.forEach(function(status) {
                    var day = new Date(status.created).getDay();
                    $scope.statuses[day] = status.status ? 'ok' : 'remove';
                });
                $scope.viewHistory = false;
            })
            .catch((error: ng.IHttpPromiseCallbackArg<Object>) => {
                if (error.status === 401) {
                    $window.location.href = '#!/login';
                } else {
                    console.log(error);
                }
            });
    };

    $scope.checkHistory = function() {
        $http.get('/organizer/earliest')
            .then((response: ng.IHttpPromiseCallbackArg<IStatus>) => {
                $scope.viewHistory = true;
                console.log('View history:', $scope.viewHistory);
                $scope.history = buildHistory(new Date(response.data.created));
            })
            .catch((err: ng.IHttpPromiseCallbackArg<Object>) => console.log(err));
    };

    $scope.hideHistory = function() {
        $scope.viewHistory = false;
    };

    // Set all days before today to false
    for (let i = 0; i < new Date().getDay(); i++) {
        $scope.statuses[i] = 'remove';
    }
    // Then get the real statuses
    $scope.getStatuses();
}]);

function buildHistory(firstDate: Date) {
    firstDate.setDate(firstDate.getDate() - firstDate.getDay());
    firstDate.setHours(0);
    firstDate.setMinutes(0);
    firstDate.setSeconds(0);
    console.log('First Date:', firstDate);
    let result = [];
    while (firstDate <= new Date()) {
        let weekEnd = new Date(firstDate);
        weekEnd.setDate(firstDate.getDate() + 7);
        weekEnd.setSeconds(weekEnd.getSeconds() - 1);
        result.push({
            start: firstDate,
            end: weekEnd
        });
        firstDate = new Date(weekEnd);
        firstDate.setSeconds(firstDate.getSeconds() + 1);
    }
    return result;
}
