interface IDevice {
    device_id: number
}

interface IReminder {
    reminder_time: string
}

interface IContact {
    id: number
    contact: string
}

angular.module('msApp').controller('ProfileController', ['$scope', '$http', '$window', 'AuthFactory', ($scope, $http, $window, AuthFactory) => {
    console.log('profile');
    $scope.saved = false;
    $scope.registeredDevice = false;

    AuthFactory.isLoggedIn()
        .then((result: ng.IHttpPromiseCallbackArg<Object>) => {
            if (result.status === 200) {
                $scope.loggedIn = true;
            } else {
                $window.location.href = '#!/login';
            }
        })
        .catch((err: ng.IHttpPromiseCallbackArg<Object>) => {
            console.log(err);
            $window.location.href = '#!/login';
        });

    $scope.existingDevice = () => {
        $http.get('/organizer/device')
            .then((result: ng.IHttpPromiseCallbackArg<IDevice>) => {
                console.log(result);
                $scope.deviceId = result.data.device_id;
                $scope.registeredDevice = true;
            })
            .catch((err: ng.IHttpPromiseCallbackArg<Object>) => {
                console.log(err);
                $scope.registeredDevice = false;
            });
    };

    $scope.registerDevice = () => {
        $http.put('/organizer', {
                deviceId: $scope.deviceIdIn
            })
            .then((response: ng.IHttpPromiseCallbackArg<Object>) => {
                console.log(response);
                if (response.status === 200) {
                    $scope.saved = true;
                    $scope.existingDevice();
                }
            })
            .catch((err: ng.IHttpPromiseCallbackArg<Object>) => console.log(err));
    };

    $scope.existingReminder = () => {
        $http.get('/reminder')
            .then((response: ng.IHttpPromiseCallbackArg<IReminder>) => {
                $scope.reminderTime = response.data.reminder_time;
            })
            .catch((err: ng.IHttpPromiseCallbackArg<Object>) => console.log(err));
    };

    $scope.saveReminder = () => {
        $http.put('/reminder', {
                reminderTime: $scope.reminderTimeIn
            })
            .then((response: ng.IHttpPromiseCallbackArg<Object>) => {
                $scope.saved = true;
            })
            .catch((err: ng.IHttpPromiseCallbackArg<Object>) => console.log(err));
    };

    $scope.existingContact = () => {
        $http.get('/contact')
            .then((response: ng.IHttpPromiseCallbackArg<Array<IContact>>) => {
                $scope.contacts = response.data;
                response.data.forEach((contact) => {
                    $scope.contactValues[contact.id] = contact.contact;
                });
            })
            .catch((err: ng.IHttpPromiseCallbackArg<Object>) => console.log(err));
    };

    $scope.saveContact = () => {
        var contactToSend = {
            contact: $scope.contact,
            contactType: $scope.contactType
        };

        $http.post('/contact', contactToSend)
            .then((response: ng.IHttpPromiseCallbackArg<Object>) => {
                if (response.status === 201) {
                    $scope.saved = true;
                    $scope.contact = undefined;
                    $scope.existingContact();
                }
            })
            .catch((err: ng.IHttpPromiseCallbackArg<Object>) => console.log(err));
    };

    $scope.editContact = (contact: IContact) => {
        var newContact = $scope.contactValues[contact.id];
        console.log('Editing contact:', contact);
        console.log('And its new value is:', newContact);
        if (newContact !== contact.contact) {
            var contactToSend = {
                contactId: contact.id,
                contact: newContact
            };
            $http.put('/contact', contactToSend)
                .then((response: ng.IHttpPromiseCallbackArg<Object>) => {
                    $scope.saved = true;
                    $scope.existingContact();
                })
                .catch((err: ng.IHttpPromiseCallbackArg<Object>) => console.log(err));
        }
    };

    $scope.removeContact = (contactId: number) => {
        $http.delete('/contact/' + contactId)
            .then((response: ng.IHttpPromiseCallbackArg<Object>) => {
                $scope.saved = true;
                $scope.existingContact();
            })
            .catch((err: ng.IHttpPromiseCallbackArg<Object>) => console.log(err));
    };

    $scope.init = () => {
        $scope.existingDevice();
        $scope.existingContact();
        $scope.existingReminder();
        $scope.editing = null;
        $scope.contactValues = {};
    };

    $scope.init();
}]);
