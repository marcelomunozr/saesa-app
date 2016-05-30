
angular.module('starter.controllers', [])

.controller('AppCtrl', function(laConfig, $rootScope, $scope, $ionicHistory, $ionicModal, $state, $timeout, $sce, $compile, $ionicModal, $cordovaInAppBrowser, $ionicLoading, Pago, User, localStorageService) {
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
  $rootScope.propiedadPortada = {};
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

  $rootScope.abrirTbk = function($data){
    var defaultOptions = {
      location: 'no',
      clearcache: 'yes',
      toolbar: 'no',
      hardwareback : 'no'
    };
    //laConfig = 'http://api.multinet.cl';
    var url = laConfig.backend + "redireccionaTbk/";
    url += "?token=" + $data.token;
    url += "&monto=" + $data.monto;
    url += "&oc=" + $data.oc;
    //console.log("La URL", url);
    $cordovaInAppBrowser.open(url, '_blank', defaultOptions)
    .then(function(event) {})
    .catch(function(event) {});
  };

  $rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event){
    if (event.url.match("/mobile/close")) {
      $cordovaInAppBrowser.close();
    }
  });

  $rootScope.$on('$cordovaInAppBrowser:loaderror', function(e, event){
    $cordovaInAppBrowser.close();
  });

  $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){
    $state.go('app.resumen-cuenta', {fetch : true});
  })

  $rootScope.abrirExterna = function($direccion){
    var defaultOptions = {
      location: 'no',
      clearcache: 'no',
      toolbar: 'no'
    };
    var ref = $cordovaInAppBrowser.open($direccion, '_system', defaultOptions)
    .then(function(event) {
      // success
    })
    .catch(function(event) {
      // error
    });

  };

  $rootScope.iniciaPagoTotal = function(){
    $ionicLoading.show({
      template: 'Iniciando pago...'
    });
    var data = {
      token : "",
      oc : "",
      monto : "",
      documento : "",
      empresa : $rootScope.propiedadPortada.empresa,
      servicio : $rootScope.propiedadPortada.numCliente,
      vencimiento : ""
    }
    User.obtieneToken($rootScope.sesionUsuario.id).then(function(res){
      data.token = res.token;
      var creaLaOc = {
        rut : $rootScope.sesionUsuario.rut,
        empresa : $rootScope.propiedadPortada.empresa,
        monto : $rootScope.propiedadPortada.financieros.deudaTotal
      };
      Pago.creaOC(creaLaOc).then(function(res){
        data.oc = res.oc;
        data.monto = $rootScope.propiedadPortada.financieros.deudaTotal;
        data.documento = $rootScope.propiedadPortada.ultimo_documento.nroDcto;
        data.vencimiento = $rootScope.propiedadPortada.ultimo_documento.fechaVcto;
        Pago.guardaDatosWebpayOC(data).then(function(res){
            $ionicLoading.hide();
            $rootScope.abrirTbk(data);
        }).catch(function(err){
          //console.log('Error en Propiedad', err);
        })
      }).catch(function(err){
        //console.log('Error en Propiedad', err);
      });
    }).catch(function(err){
      //console.log('Error en Propiedad', err);
    });
  }

  $scope.goBack = function() {
    $ionicHistory.goBack();
  };

  $scope.doLogin = function() {
    //console.log('Doing login', $scope.formdata);
    User.login($scope.formdata).then(function(response){
      if(response.idUsuario != null){
        localStorageService.set('user.id', response.idUsuario);
        $state.go('app.resumen-cuenta');
      }
    }).catch(function(error){
      //console.log('Error: ', error);
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

.controller('RegisterCtrl', function($scope, $rootScope, $ionicHistory, $state) {
	$scope.regdata = {};
  $scope.idUsuario = '';
	//console.log('paso', $scope.regdata);
  $scope.goBack = function() {
    if($rootScope.originTrack != 'register.form'){
      if($rootScope.originTrack == ''){
        $state.go('app.resumen-cuenta');
      }else{
        $state.go($rootScope.originTrack);
      }
    }else{
      $ionicHistory.goBack();
    }
  };
})

.controller('RegisterFormCtrl', function($scope, $rootScope, $sce, $compile, $state, $stateParams, $ionicHistory, User, localStorageService){
	$scope.regdata.paso = 1;
  $scope.registerUser = function(){
    //console.log('paso', $scope.formdata);
    User.register($scope.formdata).then(function(response){
      $scope.idUsuario = response.idUsuario;
      localStorageService.set('user.id', response.idUsuario);
      //console.log('ID del Registro', $scope.idUsuario);
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

.controller('RegisterAddAccountCtrl', function($scope, $rootScope, $sce, $compile, $state, $stateParams, $ionicHistory, $ionicLoading, localStorageService, Property){
  $('#numCliente').click(function() {
    $('#showNumCliente').fadeIn(300);
  });
  $('#numBoleta').click(function() {
    $('#showNumBoleta').fadeIn(300);
  });
  $('.showsBoleta').click(function() {
    $(this).fadeOut(300);
  });
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
    //console.log('Los datos', $scope.formdata);
  }
  $scope.formdata = [];
  $scope.formdata.codEmpresa = -1;
  $scope.formdata.relPropiedad = -1;

})

.controller('ResumenCtrl', function($rootScope, $scope, $ionicLoading, $state, $stateParams, $timeout, capitalizeFilter, GraficoCuenta, User, Property, Pago, localStorageService){
    $scope.cargando = true;
    $scope.linkPago = 'http://portal.saesa.cl:7778/portal/page?_pageid=1052,9429437&_dad=portal&_schema=PORTAL&_requestedpageid=PAG_WEB_V2_PAGUELINEA';
    //console.log('## Los stateParams ##', $stateParams);
    //console.log("LS Propiedad: ", $rootScope.propiedadActiva);
    //console.log("Propeidad Portada: ", $rootScope.propiedadActiva);
    var userId = localStorageService.get('user.id');
    var eltimer = $timeout(function(){
      $ionicLoading.hide();
      //console.log('timeout');
    }, 10000);
    $scope.$on('$ionicView.beforeEnter', function(){
	    if($stateParams.fetch){
				$scope.fetchUser(true);
	    }
      $ionicLoading.show({
        template: 'Consultando Información...'
      });
    });
    $scope.iniciaPago = function(){
      $rootScope.iniciaPagoTotal();
    }
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
          //console.log("LA propiedad activa", $rootScope.propiedadActiva);
          $rootScope.propiedadActiva = idPropiedadPortada;
          localStorageService.set('user.propiedadActiva', $rootScope.propiedadActiva);
          Property.getDetails(idPropiedadPortada).then(function(respuesta){
			      $rootScope.propiedadPortada.numCliente  = respuesta.detalle.Property.client_number;
            $rootScope.propiedadPortada.empresa     = respuesta.detalle.Property.related_enterprise;
			      $rootScope.propiedadPortada.consumo     = respuesta.detalle.Property.consumption;
			      $rootScope.propiedadPortada.detalles    = respuesta.detalle.Property.details;
			      $rootScope.propiedadPortada.financieros = respuesta.detalle.Property.financial;
            $rootScope.propiedadPortada.last_voucher = respuesta.detalle.Property.last_voucher.url;
            $rootScope.propiedadPortada.ultimo_documento = respuesta.detalle.Property.last_voucher;
			      //console.log('Propiedad de Portada: ', $rootScope.propiedadPortada);
			    }).catch(function(error){
			      //console.log('Error en Propiedad', error);
			    }).finally(function(){
			      //console.log('La Propiedad portada', $rootScope.propiedadPortada);
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
            var intervalo = 20;
			      angular.forEach($rootScope.propiedadPortada.consumo, function(objeto, llave){
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
            intervalo = Math.ceil(maximoGrafico / 6)
			      //console.log("Valor maximo del grafico", maximoGrafico);
			      var chart = new CanvasJS.Chart("chartContainer",{
			        animationEnabled: true,
			        interactivityEnabled: false,
			        backgroundColor: "#fcfcfc",
			        colorSet: "colorCol",
			        dataPointMaxWidth: 12,
			        height: 180,
			        axisY:{
			          interval: intervalo,
			          maximum: topeGrafico
			        },
			        data: GraficoCuenta.transformDatos($rootScope.propiedadPortada.consumo, maximoGrafico)
			      });
            //console.log('La sesion', $rootScope.sesionUsuario);
            chart.render();
			      $ionicLoading.hide();
			      $timeout.cancel(eltimer);
			    });
			  }else{
			    $state.go('register.addaccount');
			  }
			}).catch(function(err){
			  //console.log('Error en Usuario', err);
			});
    }
    $scope.fetchUser();
		$scope.$on('$destroy', function(event){
			$timeout.cancel(eltimer);
		});
})

.controller('DocumentosImpagosCtrl', function($scope, $rootScope, $ionicLoading, $stateParams, Property, DocumentosImpagos, User, Pago){
  $scope.documentos = DocumentosImpagos.all();
  $scope.cuenta = {};
  $scope.total = 0;
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
  });
  //console.log($rootScope.propiedadPortada),
  $scope.listadocumentos = [];

  Property.getDueDocuments($stateParams.propertyId).then(function(respuesta){
    //console.log('La Respuesta', respuesta);
    $scope.cuenta.detalle = respuesta.detalle.details;
    $scope.cuenta.documentos = respuesta.detalle.unpaid;
    $scope.saldoTotal = 0;
    $scope.seleccionados = 0;
    angular.forEach($scope.cuenta.documentos, function(value, key) {
      $scope.cuenta.documentos[key].seleccionado = false;
    })
    //console.log("Impagos", $scope.cuenta.documentos);
    $scope.iniciaPago = function(){
      if($scope.seleccionados > 0){
        $ionicLoading.show({
          template: 'Iniciando pago...'
        });
        var data = {
          token : "",
          oc : "",
          monto : "",
          documentos : [],
          empresa : $rootScope.propiedadPortada.empresa,
          servicio : $rootScope.propiedadPortada.numCliente
        }
        User.obtieneToken($rootScope.sesionUsuario.id).then(function(res){
          data.token = res.token;
          var creaLaOc = {
            rut : $rootScope.sesionUsuario.rut,
            empresa : $rootScope.propiedadPortada.empresa,
            monto : $scope.saldoTotal
          };
          Pago.creaOC(creaLaOc).then(function(res){
            data.oc = res.oc;
            data.monto = $scope.saldoTotal;
            angular.forEach($scope.cuenta.documentos, function(value, key) {
              if(value.seleccionado == true){
                var documento = {
                  monto : parseInt(value.saldo),
                  nroDocumento : value.nroDcto,
                  vencimiento : value.fechaVcto
                }
                data.documentos.push(documento);
              }
            });
            //console.log("Los datos hermanos", data);
            Pago.guardaVariosDatosWebpayOC(data).then(function(res){
              $ionicLoading.hide();
              $rootScope.abrirTbk(data);
            }).catch(function(err){
              //console.log('Error en Propiedad', err);
            })
          }).catch(function(err){
            //console.log('Error en Propiedad', err);
          });
        }).catch(function(err){
          //console.log('Error en Propiedad', err);
        });
      }else{
        $rootScope.iniciaPagoTotal();
      }
    }
    $scope.selectDocumento = function(ind){
      var seleccionados = 0;
      var saldoTotal = 0;
      $scope.cuenta.documentos[ind].seleccionado = !$scope.cuenta.documentos[ind].seleccionado;
      angular.forEach($scope.cuenta.documentos, function(value, key) {
        if(value.seleccionado == true){
          seleccionados += 1;
          saldoTotal += parseInt(value.saldo);
        }
      })
      $scope.seleccionados = seleccionados;
      $scope.saldoTotal = saldoTotal;
    };
  }).catch(function(err){
    //console.log('El Cagazo', err);
  }).finally(function(){
    //console.log('El Detalle', $scope.cuenta.detalle);
    //console.log('Documentos', $scope.cuenta.documentos);
    $ionicLoading.hide();
  });
})

.controller('AsociadosCtrl', function($scope, $rootScope, $timeout, $ionicPopup, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicHistory, $state, $q, $ionicLoading, localStorageService, ServiciosAsociados, Property){
  $scope.currSlide = $ionicSlideBoxDelegate.currentIndex();
  $scope.PropiedadesUsuario = [];
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
    $scope.poblarPropiedad().then(function(res){
      //console.log('Termino de cargar las propiedades');
      execute();
    }).catch(function(err){
      $ionicLoading.hide();
    }).finally(function(){
      $ionicSlideBoxDelegate.update();
      $ionicLoading.hide();
      //console.log("LA WEA DE LA WEA", $rootScope.slideServicios);
    });
  });

  $scope.marcarComoPortada = function(idPortada){
    $rootScope.propiedadActiva = idPortada;
    localStorageService.set('user.propiedadActiva', $rootScope.propiedadActiva);
    $state.go('app.resumen-cuenta', {fetch : true}, {location: false, inherit:false, reload:false});
  }

  $scope.modalConfirmacionEliminar = function(laPropiedad) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Eliminar Propiedad',
      template: 'Seguro que desea eliminar la propiedad ' + laPropiedad.property_nickname,
      cancelText: 'Cancelar',
      okText: 'Aceptar'
    });
    confirmPopup.then(function(res) {
      if(res) {
        localStorageService.set('user.propiedadActiva', 0);
        $rootScope.propiedadActiva = 0;
        $scope.eliminarServicio(laPropiedad);
      }
    });
  };

  $scope.eliminarServicio = function(laPropiedad){
    var propiedades = $scope.PropiedadesUsuario.length;
    //console.log('Eliminar Servicio');
    //console.log("Propiedades: ", laPropiedad);
    Property.removeProperty({idPropiedad: laPropiedad.id, idUsuario: laPropiedad.user_id}).then(function(res){
      //console.log("LLEGO LA RESPUESTA!", res);

      //console.log("hasta aca se deberia haber ejecutado");
    }).catch(function(err){
      //console.log(err);
    }).finally(function(){
      $state.go('app.resumen-cuenta', {fetch : true}, {location: false, inherit:false, reload:false});
    });
  }

  $scope.poblarPropiedad = function(){
    var res = $q.defer();
    var purasPromesas = [];
    function obtieneDetalle(laPropiedad, llave){
      var prom = $q.defer();
      Property.getDetails(laPropiedad.id).then(function(response){
        var portada = false;
        //console.log($rootScope.propiedadActiva);
        if($rootScope.propiedadActiva == laPropiedad.id){
          portada = true;
        }
        $scope.PropiedadesUsuario[llave]  = {esPortada:portada, propiedad: laPropiedad, detalles: response.detalle.Property};
        prom.resolve();
      }).catch(function(err){
        //console.log("ERROR EN SERVICIO", err);
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
    //console.log($scope.PropiedadesUsuario);
    $rootScope.slideServicios = $scope.PropiedadesUsuario;
  }
  $scope.nextSlide = function() {
    //console.log('next');
    $ionicSlideBoxDelegate.next();
  }
  $scope.prevSlide = function() {
    //console.log('prev');
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
  $scope.empresas = [];
  $scope.empresas[22] = {
      "idEmpresa" : 22,
      "numeroTelefono" : "600 4012021",
      "clickeable" : "6004012020",
      "empresa" : "Frontel"
  };
  $scope.empresas[39] = {
      "idEmpresa" : 39,
      "numeroTelefono" : "600 4012020",
      "clickeable" : "6004012020",
      "empresa" : "Luz Osorno"
  };
  $scope.empresas[23] = {
      "idEmpresa" : 23,
      "numeroTelefono" : "600 4012020",
      "clickeable" : "6004012020",
      "empresa" : "Saesa"
  };
  $scope.empresas[24] = {
      "idEmpresa" : 24,
      "numeroTelefono" : "600 4012022",
      "clickeable" : "6004012022",
      "empresa" : "Edelaysen"
  };
  $scope.formdata = [];
  $scope.activa = $scope.empresas[23];
  $scope.formdata.propiedad = -1;
  $scope.formdata.tipofalla = -1;
  $scope.cuandoCambia = function(){
    //console.log($scope.propiedades[$scope.formdata.propiedad]);
    var indiceActivo = parseInt($scope.propiedades[$scope.formdata.propiedad].related_enterprise);
    if(angular.isNumber(indiceActivo)){
      $scope.activa = $scope.empresas[indiceActivo];
    }
    //console.log("Cambia activa", $scope.activa);
  }
  //console.log("La Activa", $scope.activa);
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
    //console.log($scope.formdata);
    var falla = {
      rut: $rootScope.sesionUsuario.rut,
      idEmpresa: $scope.propiedades[$scope.formdata.propiedad].related_enterprise,
      idServicio: $scope.propiedades[$scope.formdata.propiedad].client_number,
      idMotivo: $scope.formdata.tipofalla,
      comentarios: $scope.formdata.comentarios,
      base64img: $scope.formdata.imagen
    };
    Fallas.reportarFalla(falla).then(function(res){
      //console.log(res);
      $ionicLoading.hide();
      $state.go('app.resumen-cuenta');
      $rootScope.tituloModal = 'Formulario enviado';
      $rootScope.textoModal = 'Se ha enviado su informe de falla';
      $rootScope.openModal();
    }).catch(function(err){
      //console.log(err);
      $ionicLoading.hide();
      $state.go('app.resumen-cuenta');
      $rootScope.tituloModal = 'Error';
      $rootScope.textoModal = 'Ha ocurrido un error al enviar el informe';
      $rootScope.openModal();
    }).finally(function(ble){
      //console.log(ble);
    });
  }
})

.controller('OficinasCtrl', function($scope, $rootScope, $ionicHistory, $log, Oficinas) {
  $scope.oficinas = [];
  $scope.regiones = [];
  $scope.comunas = [];
  $scope.validaComunas = [];
  $scope.filtrosOficinas = [];
  $scope.buscarOficina = {
    nombreComuna: ""
  };
  Oficinas.all().then(function(response){
    $scope.oficinas = response.oficinas;
    angular.forEach(response.oficinas, function(value, key){
      if($scope.regiones.indexOf(value.nombreRegion) == -1){
        $scope.regiones.push(value.nombreRegion);
      }
      if($scope.validaComunas.indexOf(value.nombreComuna) == -1){
        $scope.validaComunas.push(value.nombreComuna);
        $scope.comunas.push({
          "labelComuna" : value.nombreComuna,
          "nombreRegion" : value.nombreRegion
        });
      }
    });
    //console.log("Objeto Comunas", $scope.comunas);
  }).catch(function(err){
    //console.log(err);
  });
  Oficinas.getFiltros().then(function(res){
    $scope.filtrosOficinas = res.filtros;
  }).catch(function(err){
    //console.log(err);
  });
  $scope.reseteaComunas = function(){
    $scope.buscarOficina.nombreComuna = "";
  }
})

.controller('OficinaCtrl', function($scope, $rootScope, $stateParams, $ionicLoading, $ionicHistory, Oficinas) {
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
    Oficinas.get($stateParams.oficinaId).then(function(res){
      $scope.oficina = res;
    }).finally(function(){
      $scope.oficina.grafico = true;
      if($scope.oficina.x == null && $scope.oficina.y == null){
        $scope.oficina.grafico = false;
      }else{
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
      }
      //console.log($scope.oficina.grafico);
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
        //console.log(response.exito);
        $state.go('login');
        $rootScope.tituloModal = 'Recuperación Exitosa';
        $rootScope.textoModal = response.vb;
        $rootScope.openModal();
      }
    }).catch(function(error){
      //console.log('Error: ', error);
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
  $(".max-text").keyup(function(){
      el = $(this);
      if(el.val().length >= 800){
          el.val( el.val().substr(0, 800) );
      } else {
          $("#charNum").text(800-el.val().length);
      }
  });
})
.controller('ContactCtrl', function($scope, $rootScope, $ionicHistory, $ionicLoading, $state, Contacto) {
  $scope.propiedades = $rootScope.sesionUsuario.Propiedades;
  $scope.enviarConsulta = function(){
    $ionicLoading.show({
      template: 'Enviando consulta...'
    });
    //console.log($scope.formdata);
    var cntacto = {
      rut: $rootScope.sesionUsuario.rut,
      idEmpresa: $scope.propiedades[0].related_enterprise,
      idServicio: $scope.propiedades[0].client_number,
      comentarios: $scope.formdata.comentarios
    };
    Contacto.enviaContacto(cntacto).then(function(res){
      //console.log(res);
      $ionicLoading.hide();
      $state.go('app.resumen-cuenta');
      $rootScope.tituloModal = 'Contacto Enviado';
      $rootScope.textoModal = 'Se ha enviado su consulta';
      $rootScope.openModal();
    }).catch(function(err){
      //console.log(err);
      $ionicLoading.hide();
      $state.go('app.resumen-cuenta');
      $rootScope.tituloModal = 'Error';
      $rootScope.textoModal = 'Ha ocurrido un error al enviar su consulta';
      $rootScope.openModal();
    }).finally(function(ble){
      //console.log(ble);
    });
  }
})

.controller('DocumentosPagosCtrl', function($scope, $rootScope, $ionicLoading, $stateParams, Property){
  $scope.pagados = [];
  $scope.detalles = [];
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
  });
  //console.log("Estate Params", $stateParams);
  Property.getUltimosPagos($stateParams.propertyId).then(function(respuesta){
    //console.log('La Respuesta', respuesta);
    $scope.pagados = respuesta.pagos;
    $scope.detalles = respuesta.detalles;
  }).catch(function(err){
    //console.log('El Cagazo', err);
  }).finally(function(){
    $ionicLoading.hide();
  });
})

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('ti-back-left');
})
;
