
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'LocalStorageModule', 'ngRut', 'ngCordova'])

.run(function($ionicPlatform, $state, $rootScope) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    console.log('############ fromState.name:', fromState.name);
    console.log('############ toState.name:' , toState.name);
    $rootScope.$broadcast('clase', {clase: toState.name, params: toParams});
    if(toState.name === 'map' && toParams.latitude != '-33.4651908'){
      $rootScope.$broadcast('showPistas');
    } else {
      $rootScope.$broadcast('hidePistas');
    }
    if(toState.name === 'map' || toState.name === 'found'){
      $rootScope.$broadcast('showEncontrados');
    }
  });
  $rootScope.$state = $state;
})

.constant('laConfig', {
    'backend' : 'http://api.multinet.cl/saesa/api/',
    'debug' : true
})

.filter('capitalize', function(){  
  return function(input){
    if(input.indexOf(' ') !== -1){
      var inputPieces,
          i;
      input = input.toLowerCase();
      inputPieces = input.split(' ');
      for(i = 0; i < inputPieces.length; i++){
        inputPieces[i] = capitalizeString(inputPieces[i]);
      }

      return inputPieces.toString().replace(/,/g, ' ');
    }
    else {
      input = input.toLowerCase();
      return capitalizeString(input);
    }
    function capitalizeString(inputString){
      return inputString.substring(0,1).toUpperCase() + inputString.substring(1);
    }
  };
})

/** LA CONFIG PO LOCOH **/
  //login
.config(function($stateProvider, $urlRouterProvider, $cordovaInAppBrowserProvider) {
  $stateProvider

  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html"
  })

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
/*  .state('app.servicios-asociados.detalle', {
    url: "/servicios-asociados/:id",
    cache: true,
    views: {
      'contenedorAsociados':{
        templateUrl: "templates/detalle-asociados.html",
        controller: "AsociadosCtrl"
      }
    }
  }) */

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
        templateUrl: "templates/oficinas.html",
        controller: "OficinasCtrl"
      }
    }
  }) 
  //la oficina
  .state('app.oficina', {
    url: "/oficinas/:oficinaId",
    cache: false,
    views: {
      'menuContent':{
        templateUrl: "templates/oficinas-servicio.html",
        controller: "OficinaCtrl"
      }
    }
  }) 


  //notificaciones
  .state('app.notificaciones', {
    url: "/notificaciones",
    cache: false,
    views: {
      'menuContent':{
        templateUrl: "templates/notificaciones.html",
        controller: "NotificacionesCtrl"
      }
    }
  }) 
  //notificaciones anteriores
  .state('app.notificaciones-anteriores', {
    url: "/notificaciones-anteriores",
    cache: false,
    views: {
      'menuContent':{
        templateUrl: "templates/notificaciones-anteriores.html",
        controller: "NotificacionesCtrl"
      }
    }
  }) 

  //contactenos
  .state('app.contactenos', {
    url: "/contactenos",
    cache: false,
    views: {
      'menuContent':{
        templateUrl: "templates/contactenos.html",
        controller: "NotificacionesCtrl"
      }
    }
  }) 

  //documentos impagos
  .state('app.documentos-impagos', {
    url: "/documentos-impagos/:propertyId",
    cache: false,
    views: {
      'menuContent':{
        templateUrl: "templates/documentos-impagos.html",
        controller: "DocumentosImpagosCtrl"
      }
    }
  }) 
  $urlRouterProvider.otherwise('/login');

  

});
