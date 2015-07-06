
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


  //register content
  .state('register', {
      url: "/register",
      controller: 'RegisterCtrl',
      templateUrl: "templates/register.html"
  })

  //registrar datos
  .state('register.form', {
    url: "/form",
    views: {
      'register': {
        templateUrl: "templates/register-form.html",
		    controller: 'RegisterFormCtrl'
      }
    }
  })

  //registrar cuenta
  .state('register.addaccount', {
    url: "/addaccount",
    views: {
      'register': {
        templateUrl: "templates/register-addaccount.html",
		    controller: 'RegisterAddAccountCtrl'
      }
    }
  })

  //olvido contraseña
  .state('forgot-password', {
    url: "/forgot-password",
    templateUrl: "templates/forgot-password.html"
  })

  //menu
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  //resumen cuenta
  .state('app.resumen-cuenta', {
    url: "/resumen-cuenta",
    cache: false,
    views: {
      'menuContent':{
        templateUrl: "templates/resumen-cuenta.html",
        controller: "ResumenCtrl"
      }
    }
  })

  //servicios asociados
  .state('app.servicios-asociados', {
    url: "/servicios-asociados",
    cache: false,
    views: {
      'menuContent':{
        templateUrl: "templates/servicios-asociados.html",
        controller: "AsociadosCtrl"
      }
    }
  }) 
  /*detalle servicio*/
  .state('app.servicios-asociados.detalle', {
    url: "/servicios-asociados/:id",
    cache: true,
    views: {
      'contenedorAsociados':{
        templateUrl: "templates/detalle-asociados.html",
        controller: "AsociadosCtrl"
      }
    }
  }) 

  //informar falla
  .state('app.informar-falla', {
    url: "/informar-falla",
    cache: false,
    views: {
      'menuContent':{
        templateUrl: "templates/informar-falla.html",
        controller: "FallaCtrl"
      }
    }
  }) 

  //oficinas
  .state('app.oficinas', {
    url: "/oficinas",
    cache: false,
    views: {
      'menuContent':{
        templateUrl: "templates/oficinas.html"
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
