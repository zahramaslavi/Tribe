var app = angular.module('myApp', ['ngMaterial']);

//Background image directive for login and register page
app.directive('backgroundImageDirective', function () {
    return function (scope, element, attrs) {
        element.css({
            //'background-image': 'url(' + attrs.backgroundImageDirective + ')',
            'background': 'url(' + attrs.backgroundImageDirective + ') no-repeat center center fixed',
            //'background-repeat': 'no-repeat center center fixed',
            '-webkit-background-size': 'cover',
            '-moz-background-size':'cover',
            '-o-background-size': 'cover',
            'background-size': 'cover',

        });
    };
})