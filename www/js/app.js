
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.forgot-password', {
    url: "/forgot-password",
    views: {
      'menuContent': {
        templateUrl: "templates/forgot-password.html"
      }
    }
  })

  .state('register', {
    url: "/register",
    controller: 'RegisterCtrl',
	templateUrl: "templates/register.html"
  })

  .state('register.form', {
    url: "/form",
    views: {
      'registros': {
        templateUrl: "templates/register-form.html",
		controller: 'RegisterFormCtrl'
      }
    }
  })

  .state('register.addaccount', {
    url: "/addaccount",
    views: {
      'registros': {
        templateUrl: "templates/register-addaccount.html",
		controller: 'RegisterAddAccountCtrl'
      }
    }
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })
  .state('login', {
    url: "/login",
	templateUrl: "templates/login.html"
  })

  $urlRouterProvider.otherwise('/login');
});
