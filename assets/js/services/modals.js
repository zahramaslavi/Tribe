var modalServices = angular.module('modalServices', ['ngMaterial']);

//A service for creating modal
modalServices.factory('myModals', function($mdDialog) {

    return {
        createTribeModal: function(ev, modalUrl) {
            //$scope.status = '  ';
            //$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
            $mdDialog.show({
                templateUrl: modalUrl,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            });
        },
        updateTribeModal: function(ev, modalUrl, name, description, tribeId, image_url) {
            //$scope.status = '  ';
            //$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
            $mdDialog.show({
                templateUrl: modalUrl,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                controller: function($mdDialog){
                    this.name = name;
                    this.description = description;
                    this.tribeId = tribeId;
                    this.image_url = image_url;
                },
                controllerAs:'modal'
            });
        },
    };
});