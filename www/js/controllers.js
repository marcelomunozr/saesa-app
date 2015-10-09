
angular.module('starter.controllers', [])

.controller('AppCtrl', function($rootScope, $scope, $ionicHistory, $ionicModal, $state, $timeout, $sce, $compile, $ionicModal, $cordovaInAppBrowser, User, localStorageService) {
  var userId = localStorageService.get('user.id');
  var laActiva = localStorageService.get('user.propiedadActiva');
  if(angular.isDefined(userId) && userId != null){
    $state.go('app.resumen-cuenta');
  }
  $scope.loginData = {};
  $rootScope.sesionUsuario = {};
  if(angular.isDefined(laActiva) && laActiva != null){
    $rootScope.propiedadActiva = laActiva;
  }else{
    $rootScope.propiedadActiva = 0;
  }
  $scope.propiedadPortada = {};
  $rootScope.modal = $ionicModal.fromTemplateUrl('templates/modal-test.html', {
    scope: $rootScope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $rootScope.modal = modal;
  });

  $rootScope.openModal = function() {
    $rootScope.modal.show();
  };

  $rootScope.closeModal = function() {
    $rootScope.modal.hide();
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
        $rootScope.tituloModal = 'Ha ocurrido un error';
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
        $rootScope.textoModal = labelError;
        $rootScope.openModal();
    });
  };
  
})

.controller('RegisterCtrl', function($scope, $rootScope, $ionicHistory) {
	$scope.regdata = {};
  $scope.idUsuario = '';
	console.log('paso', $scope.regdata);
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };

})

.controller('RegisterFormCtrl', function($scope, $rootScope, $sce, $compile, $state, User, localStorageService){
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
        $rootScope.tituloModal = 'Ha ocurrido un error';
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
        $rootScope.textoModal = labelError;
        $rootScope.openModal();

    }).finally();
  }
  
})

.controller('RegisterAddAccountCtrl', function($scope, $rootScope, $sce, $compile, $state, $ionicHistory, $ionicLoading, localStorageService, Property){
  $ionicHistory.nextViewOptions({
    disableBack: false
  });
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
  $('#numCliente').click(function() {
    $('#showNumCliente').fadeIn(300);
  });
  $('#numBoleta').click(function() {
    $('#showNumBoleta').fadeIn(300);
  });
  $('.showsBoleta').click(function() {
    $(this).fadeOut(300);
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
        $rootScope.propiedadActiva = response.propertyId;
        localStorageService.set('user.propiedadActiva', $rootScope.propiedadActiva);
        $state.go('app.resumen-cuenta', {fetch : true});
        /** Navegamos a resumen donde pediremos los datos **/
      }).catch(function(error){
        /** Levantamos modal con mensajes de error **/
        var labelError = '';
        $rootScope.tituloModal = 'Ha ocurrido un error';
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
        $rootScope.textoModal = labelError;
        $rootScope.openModal();
      }).finally(function(){
        $ionicLoading.hide();
      });
    }else{
      $state.go('register.form');
    }
    console.log('Los datos', $scope.formdata);
  }
  $scope.formdata = [];
  $scope.formdata.codEmpresa = -1;
  $scope.formdata.relPropiedad = -1;

})

.controller('ResumenCtrl', function($rootScope, $scope, $ionicLoading, $state, $stateParams, $timeout, capitalizeFilter, GraficoCuenta, User, Property, localStorageService){
    $scope.cargando = true;
    console.log('## Los stateParams ##', $stateParams);
    var userId = localStorageService.get('user.id');
    var eltimer = $timeout(function(){
      $ionicLoading.hide();     
      console.log('timeout');
    }, 3000);
    $scope.$on('$ionicView.beforeEnter', function(){
	    if($stateParams.fetch){
				$scope.fetchUser(true);
	    }
      $ionicLoading.show({
        template: 'Consultando Información...'
      });      
    });

    $scope.fetchUser = function($cache){
			User.fetchMeTheUser(userId, $cache).then(function(response){
			  var propiedadPortada = {};
			  $rootScope.sesionUsuario = response.sesionUsuario;
			  if(!angular.isUndefined(response.sesionUsuario.Propiedades[0])){
          var idPropiedadPortada = 0;
          if($rootScope.propiedadActiva == 0){
            idPropiedadPortada = response.sesionUsuario.Propiedades[0].id;
          }else{
            idPropiedadPortada = $rootScope.propiedadActiva;
          }
          $rootScope.propiedadActiva = idPropiedadPortada;
          localStorageService.set('user.propiedadActiva', $rootScope.propiedadActiva);
          Property.getDetails(idPropiedadPortada).then(function(respuesta){
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
			      var maximoGrafico = 0;
			      var maxAnterior = 0;
			      var maxActual = 0;
			      angular.forEach($scope.propiedadPortada.consumo, function(objeto, llave){
			          if(parseInt(objeto.anoActual) > maxActual){
			            maxActual = parseInt(objeto.anoActual);
			          }
			          if(parseInt(objeto.anoAnterior) > maxAnterior){
			            maxAnterior = parseInt(objeto.anoAnterior);
			          }
			      });
			      if(maxAnterior > maxActual){
			        maximoGrafico = parseInt(maxAnterior);
			      }else{
			        maximoGrafico = parseInt(maxActual);
			      }
			      topeGrafico = maximoGrafico + 10;
			      console.log("Valor maximo del grafico", maximoGrafico);
			      var chart = new CanvasJS.Chart("chartContainer",{
			        animationEnabled: true,
			        interactivityEnabled: false,
			        backgroundColor: "#fcfcfc",
			        colorSet: "colorCol",
			        dataPointMaxWidth: 12,
			        height: 180,
			        axisY:{
			          interval: 20,
			          maximum: topeGrafico,
			          stripLines:[{                
			              value: maximoGrafico,
			              labelFontSize:10,
			              thickness: 1,
			              labelBackgroundColor: "white",
			              color: "#00599b",
			              showOnTop: true
			          }]
			        },
			        data: GraficoCuenta.transformDatos($scope.propiedadPortada.consumo, maximoGrafico)
			      });
            console.log('La sesion', $rootScope.sesionUsuario);
            chart.render();
			      $ionicLoading.hide();
			      $timeout.cancel(eltimer);			      
			    });
			  }else{
			    $state.go('register.addaccount');
			  }
			}).catch(function(err){
			  console.log('Error en Usuario', err);
			});	    
    }
    $scope.fetchUser();
		$scope.$on('$destroy', function(event){
			$timeout.cancel(eltimer);
		});
})

.controller('DocumentosImpagosCtrl', function($scope, $rootScope, $ionicLoading, $stateParams, Property, DocumentosImpagos){
  $scope.documentos = DocumentosImpagos.all();
  $scope.cuenta = {};
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

.controller('AsociadosCtrl', function($scope, $rootScope, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicHistory, $state, $q, localStorageService, ServiciosAsociados, $ionicLoading, Property){
  $scope.currSlide = $ionicSlideBoxDelegate.currentIndex();
  $scope.PropiedadesUsuario = [];
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
    $scope.poblarPropiedad().then(function(res){
      console.log('Termino de cargar las propiedades');
      execute();
    }).catch(function(err){
      $ionicLoading.hide();
    }).finally(function(){
      $ionicSlideBoxDelegate.update();
      $ionicLoading.hide();
      console.log("LA WEA DE LA WEA", $rootScope.slideServicios);
    });

  });
  
  $scope.marcarComoPortada = function(idPortada){
    $rootScope.propiedadActiva = idPortada;
    localStorageService.set('user.propiedadActiva', $rootScope.propiedadActiva);
    $state.go('app.resumen-cuenta', {fetch : true});
  }

  $scope.poblarPropiedad = function(){
    var res = $q.defer();
    var purasPromesas = [];
    function obtieneDetalle(laPropiedad, llave){
      var prom = $q.defer();
      Property.getDetails(laPropiedad.id).then(function(response){
        var portada = false;
        console.log($rootScope.propiedadActiva);
        if($rootScope.propiedadActiva == laPropiedad.id){
          portada = true;
        }
        $scope.PropiedadesUsuario[llave]  = {esPortada:portada, propiedad: laPropiedad, detalles: response.detalle.Property};
        prom.resolve();
      }).catch(function(err){
        console.log("ERROR EN SERVICIO", err);
        prom.reject({
          reason: 'no',
          message: 'ingreso incorrecto.'
        });
      });
      return prom.promise;
    }
    angular.forEach($rootScope.sesionUsuario.Propiedades, function(objeto, llave){
      purasPromesas.push(obtieneDetalle(objeto, llave));
    });
    $q.all(purasPromesas).then(res.resolve);
    return res.promise;
  }
  $scope.slideChanged = function() {  
    $ionicScrollDelegate.scrollTop(false);
    $scope.currSlide = $ionicSlideBoxDelegate.currentIndex();
    $timeout( function() {
      $ionicScrollDelegate.resize();
    }, 50);
  };  
  function execute() {
    console.log($scope.PropiedadesUsuario);
    $rootScope.slideServicios = $scope.PropiedadesUsuario;
  }  
  $scope.nextSlide = function() {
    console.log('next');
    $ionicSlideBoxDelegate.next();
  }
  $scope.prevSlide = function() {
    console.log('prev');
    $ionicSlideBoxDelegate.previous();
  }
  
  $(".menu-asociados a").click(function(){
    $(".menu-asociados a").removeClass('active');
    $(this).addClass('active');
  });
})

.controller('FallaCtrl', function($rootScope, $scope, $cordovaCamera, $ionicPlatform, $state, $ionicLoading, Fallas){
  $scope.fallas = Fallas.lasFallas();
  $scope.propiedades = $rootScope.sesionUsuario.Propiedades;
  $scope.formdata = [];
  $scope.formdata.propiedad = -1;
  $scope.formdata.tipofalla = -1;
  console.log("Las Propiedades", $scope.propiedades);
  $scope.abrirDialogoSubida = function(){
    $ionicPlatform.ready(function(){
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation:true
      };
      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.formdata.imagen = "data:image/jpeg;base64," + imageData;
      }, function(err) {
        // error
      });
    });
  }

  $scope.informarLaFalla = function(){
    $ionicLoading.show({
      template: 'Enviando formulario...'
    });
    console.log($scope.formdata);
    var falla = {
      rut: $rootScope.sesionUsuario.rut,
      idEmpresa: $scope.propiedades[$scope.formdata.propiedad].related_enterprise,
      idServicio: $scope.propiedades[$scope.formdata.propiedad].client_number,
      idMotivo: $scope.formdata.tipofalla,
      comentarios: $scope.formdata.comentarios,
      base64img: $scope.formdata.imagen
    };
    Fallas.reportarFalla(falla).then(function(res){
      console.log(res);
      $ionicLoading.hide();
      $state.go('app.resumen-cuenta');
      $rootScope.tituloModal = 'Formulario enviado';
      $rootScope.textoModal = 'Se ha enviado su informe de falla';
      $rootScope.openModal();
    }).catch(function(err){
      console.log(err);
      $ionicLoading.hide();
      $state.go('app.resumen-cuenta');
      $rootScope.tituloModal = 'Error';
      $rootScope.textoModal = 'Ha ocurrido un error al enviar el informe';
      $rootScope.openModal();
    }).finally(function(ble){
      console.log(ble);
    });
  }
})


.controller('OficinasCtrl', function($scope, $rootScope, $ionicHistory, Oficinas) {
 $scope.oficinas = [];
  Oficinas.all().then(function(response){
    $scope.oficinas = response.oficinas;
  }).catch(function(err){
    console.log(err);
  });
})

.controller('OficinaCtrl', function($scope, $rootScope, $stateParams, $ionicLoading, $ionicHistory, Oficinas) {
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

.controller('ForgotPswdCtrl', function($scope, $rootScope, $state, User) {
  $scope.rememberThePassword = function(){
    User.forgotPassword($scope.formdata.rut).then(function(response){
      if(response.exito == 1){
        console.log(response.exito);
        $state.go('login');
        $rootScope.tituloModal = 'Recuperación Exitosa';
        $rootScope.textoModal = response.vb;
        $rootScope.openModal();
      }
    }).catch(function(error){
      console.log('Error: ', error);
      /** Levantamos modal con mensajes de error **/
        var labelError = '';
        $rootScope.tituloModal = 'Ha ocurrido un error';
        switch(error.err){
          case 'error-api':
            labelError = 'Hubo un error al conectar al servidor';
            break;
          case 'empty-password':
            labelError = 'Debe ingresar su contraseña';
            break;
          case 'empty-rut':
            labelError = 'Debe ingresar su rut para continuar';
            break;
          case 'sin-datos':
            labelError = 'No se recibieron datos';
            break;
          default:
            labelError = 'Error al procesar la información';
            break;
        }
        $rootScope.textoModal = labelError;
        $rootScope.openModal();
    });
  }
})

.controller('NotificacionesCtrl', function($scope, $rootScope, $ionicHistory, Notificaciones) {
  $scope.notificaciones = Notificaciones.all();
})

.controller('DocumentosPagosCtrl', function($scope, $rootScope, $ionicLoading, $stateParams, Property){
  $scope.pagados = [];
  $scope.detalles = [];
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
  });
  console.log("Estate Params", $stateParams);
  Property.getUltimosPagos($stateParams.propertyId).then(function(respuesta){
    console.log('La Respuesta', respuesta);
    $scope.pagados = respuesta.pagos;
    $scope.detalles = respuesta.detalles;
  }).catch(function(err){
    console.log('El Cagazo', err);
  }).finally(function(){
    $ionicLoading.hide();
  });
})

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('ti-back-left');
})
;