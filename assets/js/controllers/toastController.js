angular.module('myApp.controllers', []).
    controller('toastCtrl', function($scope, $mdToast, $document) {
        //$scope.imagePath = "/images/tribe4.jpg";
        $scope.toastPosition= {
            //bottom: false,
            top: 0,
            left: 0
            //right: true
        };

        $scope.showSimpleToast = function() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent("hi")
                    .position($scope.toastPosition)
                    .hideDelay(3000)
            );
        };

});