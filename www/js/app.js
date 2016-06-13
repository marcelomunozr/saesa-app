
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'LocalStorageModule', 'ngRut', 'ngCordova', 'angularFileUpload'])

.run(function($ionicPlatform, $state, $rootScope, $log, localStorageService, $ionicPopup) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    if(window.cordova && window.analytics) {
			window.analytics.startTrackerWithId('UA-68788191-1');
    }
    try{
			var push = PushNotification.init({
					android: {
							senderID: '1015297443872'
					},
					ios: {
							alert: 'true',
							badge: 'false',
							sound: 'true'
					},
					windows: {}
			});
			push.on('registration', function(resp) {
        localStorageService.set('deviceregistrationId', resp.registrationId);
        localStorageService.set('deviceos', ionic.Platform.platform());
			});
			push.on('notification', function(data) {
        //console.log('notification', data);
        $ionicPopup.alert({
           title: data.title,
           template: data.message,
           buttons: [{
            text: '<b>Ver notificaciones</b>',
            type: 'button-positive',
            onTap: function(e) {
              $state.go('app.notificaciones', {}, {location: true});
            }
          }]
        });
			});
			push.on('error', function(e) {
        //console.log('error', e);
			});
		} catch(err){
			$log.log(err);
		}
    $ionicPlatform.registerBackButtonAction(function (event) {
      if($state.current.name=="app.resumen-cuenta"){
        navigator.app.exitApp();
      }
      else {
        //console.log("EL ANTERIOR: ", $rootScope.originTrack );
        navigator.app.backHistory();
      }
    }, 100);
  });
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    //console.log('############ fromState.name:', fromState.name);
    //console.log('############ toState.name:' , toState.name);
    $rootScope.$broadcast('clase', {clase: toState.name, params: toParams});
    if(window.cordova && window.analytics){
			window.analytics.trackView(toState.name);
	    $log.debug('yep');
    } else {
	    $log.debug('nope');
    }
    $rootScope.originTrack = fromState.name;
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
.config(function($stateProvider, $urlRouterProvider, $cordovaInAppBrowserProvider, $compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|http|ftp|mailto|tel|sms):/);
  $stateProvider
  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl',
    onEnter: function($state, User){
      if(User.isLogged()){
        $state.go('app.resumen-cuenta',{fetch : true});
      }
    }
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
    controller: 'AppCtrl',
    onEnter: function(User, $state){
      if(!User.isLogged()){
        $state.go('login');
      }
    }
  })

  //resumen cuenta
  .state('app.resumen-cuenta', {
    url: "/resumen-cuenta?fetch",
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

  //documentos pagados
  .state('app.documentos-pagados', {
    url: "/documentos-pagados/:propertyId",
    cache: false,
    views: {
      'menuContent':{
        templateUrl: "templates/documentos-pagados.html",
        controller: "DocumentosPagosCtrl"
      }
    }
  })

  //configuracion
  .state('app.pantalla-configuracion', {
    url: "/pantalla-configuracion/",
    cache: false,
    views: {
      'menuContent':{
        templateUrl: "templates/pantalla-configuracion.html"
      }
    }
  })

  $urlRouterProvider.otherwise('/login');

});
