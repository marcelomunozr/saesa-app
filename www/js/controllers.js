
angular.module('starter.controllers', [])

.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $state, $timeout, $sce, $compile, $ionicModal, $cordovaInAppBrowser, User, localStorageService) {
  var userId = localStorageService.get('user.id');
  if(angular.isDefined(userId) && userId != null){
    $state.go('app.resumen-cuenta');
  }
  $scope.loginData = {};
  $rootScope.sesionUsuario = {};
  $scope.propiedadPortada = {};
  $scope.modal = $ionicModal.fromTemplateUrl('templates/modal-test.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.abrirExterna = function($direccion){
    var defaultOptions = {
      location: 'no',
      clearcache: 'no',
      toolbar: 'no'
    };
    $cordovaInAppBrowser.open($direccion, '_system', defaultOptions)
    .then(function(event) {
      // success
    })
    .catch(function(event) {
      // error
    });
  };

  $scope.goBack = function() {
    $ionicHistory.goBack();
  };

  $scope.doLogin = function() {
    console.log('Doing login', $scope.formdata);
    User.login($scope.formdata).then(function(response){
      if(response.idUsuario != null){
        localStorageService.set('user.id', response.idUsuario);
        $state.go('app.resumen-cuenta');
      }
    }).catch(function(error){
      console.log('Error: ', error);
      /** Levantamos modal con mensajes de error **/
        var labelError = '';
        $scope.tituloModal = 'Ha ocurrido un error';
        switch(error.err){
          case 'password-incorrecto':
            labelError = 'La contraseña es incorrecta';
            break;
          case 'no-registrado':
            labelError = 'El rut no se encuentra registrado';
            break;
          case 'empty-password':
            labelError = 'Debe ingresar su contraseña';
            break;
          case 'empty-rut':
            labelError = 'Debe ingresar su rut para continuar';
            break;
          default:
            labelError = 'Error al procesar la información';
            break;
        }
        $scope.textoModal = labelError;
        $scope.openModal();
    });
  };
  
})

.controller('RegisterCtrl', function($scope,$ionicHistory) {
	$scope.regdata = {};
  $scope.idUsuario = '';
	console.log('paso', $scope.regdata);
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };

})

.controller('RegisterFormCtrl', function($scope, $sce, $compile, $state, User, localStorageService){
	$scope.regdata.paso = 1;
	$scope.registerUser = function(){
    console.log('paso', $scope.formdata);
    User.register($scope.formdata).then(function(response){
      $scope.idUsuario = response.idUsuario;
      localStorageService.set('user.id', response.idUsuario);
      console.log('ID del Registro', $scope.idUsuario);
      $state.go('register.addaccount');
    }).catch(function(err){
      var labelError = '';
        $scope.tituloModal = 'Ha ocurrido un error';
        switch(error.err){
          case 'error-registro':
            labelError = 'Ha ocurrido un error con el registro';
            break;
          case 'faltan-campos':
            labelError = 'Faltan campos por rellenar en el registro';
            break;
          default:
            labelError = 'Error al procesar la información';
            break;
        }
        $scope.textoModal = labelError;
        $scope.openModal();

    }).finally();
  }
  
})

.controller('RegisterAddAccountCtrl', function($scope, $sce, $compile, $state, $ionicHistory, $ionicLoading, localStorageService, Property){
  $ionicHistory.nextViewOptions({
    disableBack: false
  });
  console.log('paso', $scope.regdata);
	$scope.regdata.paso = 2;
  $scope.registerPropertyToUser = function(){
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
    if(!angular.isUndefined(localStorageService.get('user.id'))){
      $scope.formdata.userId = localStorageService.get('user.id');
      Property.addProperty($scope.formdata).then(function(response){
        $state.go('app.resumen-cuenta');
        /** Navegamos a resumen donde pediremos los datos **/
      }).catch(function(error){
        /** Levantamos modal con mensajes de error **/
        var labelError = '';
        $scope.tituloModal = 'Ha ocurrido un error';
        switch(error.err){
          case 'no-valido':
            labelError = '';
            break;
          case 'boleta-no-existe':
            labelError = 'El número de boleta no existe';
            break;
          case 'ya-existe':
            labelError = 'Esta propiedad ya se encuentra relacionada a este usuario';
            break;
          default:
            labelError = 'Error al procesar la información';
            break;
        }
        $scope.textoModal = labelError;
        $scope.openModal();
      }).finally(function(){
        $ionicLoading.hide();
      });
    }else{
      $state.go('register.form');
    }
    console.log('Los datos', $scope.formdata);
  }

})

.controller('ResumenCtrl', function($rootScope, $scope, $ionicHistory, $ionicLoading, $state, capitalizeFilter, GraficoCuenta, User, Property, localStorageService){
    $scope.cargando = true;
    var userId = localStorageService.get('user.id');
    $scope.$on('$ionicView.beforeEnter', function(){
      $ionicLoading.show({
        template: 'Consultando Información...'
      });
    });
    User.fetchMeTheUser(userId).then(function(response){
      var propiedadPortada = {};
      $rootScope.sesionUsuario = response.sesionUsuario;
      if(!angular.isUndefined(response.sesionUsuario.Propiedades[0])){
        Property.getDetails(response.sesionUsuario.Propiedades[0].id).then(function(respuesta){
          $scope.propiedadPortada.datos       = response.sesionUsuario.Propiedades[0];
          $scope.propiedadPortada.consumo     = respuesta.detalle.Property.consumption;
          $scope.propiedadPortada.detalles    = respuesta.detalle.Property.details;
          $scope.propiedadPortada.financieros = respuesta.detalle.Property.financial;
          console.log('Propiedad de Portada: ', respuesta);
        }).catch(function(error){
          console.log('Error en Propiedad', error);
        }).finally(function(){
          console.log('La Propiedad', $scope.propiedadPortada);
          $scope.cargando = false;
          CanvasJS.addColorSet("colorCol",
            [
            "#d7e4ec",
            "#17c300"             
            ]
          );
          var chart = new CanvasJS.Chart("chartContainer",{
            animationEnabled: true,
            interactivityEnabled: false,
            backgroundColor: "#fcfcfc",
            colorSet: "colorCol",
            dataPointMaxWidth: 12,
            height: 160,
            axisY:{
              maximum: 150
            },
            data: GraficoCuenta.transformDatos($scope.propiedadPortada.consumo)
          });
          $ionicLoading.hide();
          chart.render();
          console.log('La sesion', $rootScope.sesionUsuario);
        });
      }else{
        $state.go('register.addaccount');
      }
    }).catch(function(err){
      console.log('Error en Usuario', err);
    });
    $ionicHistory.nextViewOptions({
      disableBack: true
    });

})

.controller('DocumentosImpagosCtrl', function($scope, $ionicHistory, $ionicLoading, $stateParams, Property, DocumentosImpagos){
  $ionicHistory.nextViewOptions({
    disableBack: false
  });
  $scope.documentos = DocumentosImpagos.all();
  $scope.cuenta = {};
  /*$ionicHistory.nextViewOptions({
    disableBack: false
  });*/

  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
  });

  Property.getDueDocuments($stateParams.propertyId).then(function(respuesta){
    console.log('La Respuesta', respuesta);
    $scope.cuenta.detalle = respuesta.detalle.details;
    $scope.cuenta.documentos = respuesta.detalle.unpaid;
  }).catch(function(err){
    console.log('El Cagazo', err);
  }).finally(function(){
    console.log('El Detalle', $scope.cuenta.detalle);
    console.log('Documentos', $scope.cuenta.documentos);
    $ionicLoading.hide();
  });


})

.controller('AsociadosCtrl', function($scope, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, $rootScope, $ionicHistory, ServiciosAsociados){
  $scope.currSlide = $ionicSlideBoxDelegate.currentIndex();
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  $scope.slideChanged = function() {  
    $ionicScrollDelegate.scrollTop(false);
    $scope.currSlide = $ionicSlideBoxDelegate.currentIndex();
    $timeout( function() {
      $ionicScrollDelegate.resize();
    }, 50);
  };  
  function execute() {    
    $rootScope.slideServicios = ServiciosAsociados.all();
  }  
  $scope.nextSlide = function() {
    console.log('next');
    $ionicSlideBoxDelegate.next();
  }
  $scope.prevSlide = function() {
    console.log('prev');
    $ionicSlideBoxDelegate.previous();
  }
  execute();
  $(".menu-asociados a").click(function(){
    $(".menu-asociados a").removeClass('active');
    $(this).addClass('active');
  });
})

.controller('FallaCtrl', function($rootScope, $ionicHistory, $scope, Fallas){
  $ionicHistory.nextViewOptions({
    disableBack: false
  });
  $scope.fallas = Fallas.lasFallas();
  $scope.propiedades = $rootScope.sesionUsuario.Propiedades;
  $('#for-file-upload').on("tap",function(){
    $('#file-upload').click();
  });
})


.controller('OficinasCtrl', function($scope, $ionicHistory, Oficinas) {
  $ionicHistory.nextViewOptions({
    disableBack: false
  });
  $scope.oficinas = [];
  Oficinas.all().then(function(response){
    $scope.oficinas = response.oficinas;
  }).catch(function(err){
    console.log(err);
  });

})

.controller('OficinaCtrl', function($scope, $stateParams, $ionicLoading, $ionicHistory, Oficinas) {
  $ionicHistory.nextViewOptions({
    disableBack: false
  });
  
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
    Oficinas.get($stateParams.oficinaId).then(function(res){
      $scope.oficina = res;  
    }).finally(function(){
      var myLatlng = new google.maps.LatLng($scope.oficina.x,$scope.oficina.y);//-40.5730256 //-73.13853890000001
      var mapOptions = {
        center: myLatlng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("map"),
          mapOptions);
      var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: $scope.oficina.direccion
      });
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
      });
      $scope.map = map;
      $ionicLoading.hide();
    });
  });

  /*$scope.initialize = function() {
    
  }*/
  //google.maps.event.addDomListener(window, 'load', initialize);
})

.controller('NotificacionesCtrl', function($scope, $ionicHistory, Notificaciones) {
  $scope.notificaciones = Notificaciones.all();
  $ionicHistory.nextViewOptions({
    disableBack: false
  });
  
})
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('ion-ios7-arrow-left');
})

;