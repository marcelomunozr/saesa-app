
angular.module('starter.controllers', [])

.controller('AppCtrl', function(laConfig, $rootScope, $scope, $ionicHistory, $ionicModal, $ionicPopup, $state, $timeout, $sce, $compile, $ionicModal, $cordovaInAppBrowser, $ionicLoading, Pago, User, localStorageService, Property) {
  // var userId = localStorageService.get('user.id');
  var laActiva = localStorageService.get('user.propiedadActiva');
  // if(angular.isDefined(userId) && userId != null){
  //   $state.go('app.resumen-cuenta', {}, {location: true, inherit:false, reload:true});
  // }
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
  $rootScope.logout = function(){
    localStorageService.clearAll();
    $state.go('login');
  }

  $rootScope.registraDispositivo = function(){
    var registrado = localStorageService.get('device.registered');
    var deviceKey =  localStorageService.get('device.registrationId');
    var operativeSystem = localStorageService.get('device.os');
    if(registrado == 0){
      var data = {
        deviceKey: deviceKey,
        userId: $rootScope.sesionUsuario.id,
        operativeSystem: operativeSystem
      };
      User.registraDispositivo(data).then(function(res){
        localStorageService.set('device.registered', 1);
      }).catch(function(err){
        //console.log("El Error", err);
      });
    }
  }

  $rootScope.openModal = function() {
    $rootScope.modal.show();
  };

  $rootScope.closeModal = function() {
    $rootScope.modal.hide();
  };

  $rootScope.abrirTbk = function($data){
    var url = laConfig.backend + "redireccionaTbk/";
    var defaultOptions = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes',
      hardwareback : 'no',
      closebuttoncaption : 'Volver',
      presentationstyle : 'pagesheet',
      zoom: 'no'
    };
    //var stringOptions = "location=yes, clearcache=yes, tootlbar=yes, hardwareback=no, closebuttoncaption=Volver, presentationstyle=pagesheet"
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
    if(event.url.match("/webpaymobile/auth_emisor.cgi")){
      $cordovaInAppBrowser.executeScript({code:'if(document.paso.length !== -1){setTimeout("document.paso.submit()", 2000);}'})
    }
  });

  $rootScope.$on('$cordovaInAppBrowser:loaderror', function(e, event){
    $cordovaInAppBrowser.close();
  });

  $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){
    $state.go('app.home', {fetch : true});
  })

  $rootScope.abrirExterna = function($direccion){
    var defaultOptions = {
      location: 'yes',
      clearcache: 'yes',
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
      documentos : [],
      empresa : $rootScope.propiedadPortada.empresa,
      servicio : $rootScope.propiedadPortada.numCliente
    }
    Property.getOnlyDueDocuments($rootScope.propiedadActiva).then(function(res){
      //console.log("Los Impagos", res);
      var documentos = res.detalle.unpaid;
      var totalPagar = 0;
      angular.forEach(documentos, function(value, key) {
        var documento = {
          monto : parseInt(value.saldo),
          nroDocumento : value.nroDcto,
          vencimiento : value.fechaVcto
        };
        totalPagar += parseInt(value.saldo);
        data.documentos.push(documento);
      });
      data.monto = totalPagar;
      User.obtieneToken($rootScope.sesionUsuario.id).then(function(res){
          data.token = res.token;
          if(data.monto == $rootScope.propiedadPortada.financieros.deudaTotal){
            var creaLaOc = {
              rut : $rootScope.sesionUsuario.rut,
              empresa : $rootScope.propiedadPortada.empresa,
              monto : $rootScope.propiedadPortada.financieros.deudaTotal
            };
            Pago.creaOC(creaLaOc).then(function(res){
              data.oc = res.oc;
              Pago.guardaVariosDatosWebpayOC(data).then(function(res){
                  $ionicLoading.hide();
                  $rootScope.abrirTbk(data);
              }).catch(function(err){
                var labelError = '';
                $rootScope.tituloModal = 'Ha ocurrido un error';
                labelError = 'Ha ocurrido un error al procesar la información, intentelo mas tarde.';
                $rootScope.textoModal = labelError;
                $ionicLoading.hide();
                $rootScope.openModal();
              });
            }).catch(function(err){
              var labelError = '';
              $rootScope.tituloModal = 'Ha ocurrido un error';
              labelError = 'Ha ocurrido un error al procesar la información, intentelo mas tarde.';
              $rootScope.textoModal = labelError;
              $ionicLoading.hide();
              $rootScope.openModal();
            });
          }

      }).catch(function(err){
        //console.log('Error en Propiedad', err);
      });
    }).catch(function(err){
      //console.log("El Error", err);
    });
  }

  $scope.goBack = function() {
    $ionicHistory.goBack();
  };

  $rootScope.marcarComoPortada = function(idPortada){
    $rootScope.propiedadActiva = idPortada;
    localStorageService.set('user.propiedadActiva', $rootScope.propiedadActiva);
    //$state.go('app.resumen-cuenta', {fetch : true}, {location: false, inherit:false, reload:true});
    $state.go($state.current, {fetch : true}, {reload: true});
  }

  $rootScope.modalConfirmacionEliminar = function(laPropiedad) {
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
        $rootScope.eliminarServicio(laPropiedad);
      }
    });
  };

  $rootScope.eliminarServicio = function(laPropiedad){
    var propiedades = $rootScope.sesionUsuario.Propiedades.length;
    //console.log('Eliminar Servicio');
    //console.log("Propiedades: ", laPropiedad);
    Property.removeProperty({idPropiedad: laPropiedad.id, idUsuario: laPropiedad.user_id}).then(function(res){
      //console.log("LLEGO LA RESPUESTA!", res);
      //console.log("hasta aca se deberia haber ejecutado");
    }).catch(function(err){
      //console.log(err);
    }).finally(function(){
      $state.go('app.home', {fetch : true}, {location: false, inherit:false, reload:false});
    });
  }
})

.controller('RegisterCtrl', function($scope, $rootScope, $ionicHistory, $ionicModal, $state, User) {
	$scope.regdata = {};
  $scope.idUsuario = '';
  $scope.formdata = {
    terms:false
  };
  $scope.terminosCondiciones = "";
  $scope.getTerminos = function(){
    User.getTerminos().then(function(res){
      console.log("Terminos y Condiciones", res);
      $scope.terminosCondiciones = res.terminos.descripcion;
    }).catch(function(err){

    });
  }
  $scope.getTerminos();
  $scope.modal = $ionicModal.fromTemplateUrl('templates/modal-terms.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.formdata.terms = false;
    $scope.modal.hide();
  };

  $scope.modalTerminosCondiciones = function(){
    $scope.tituloModal = 'Términos y Condiciones';
    $scope.textoModal = 'Términos y Condiciones';
    $scope.openModal();
  }

  $scope.acceptTerms = function(){
    $scope.formdata.terms = true;
    $scope.modal.hide();
  }

  $scope.goBack = function() {
    if($rootScope.originTrack != 'register.form'){
      if($rootScope.originTrack == ''){
        $state.go('app.home');
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
  $scope.listaRelaciones = [];
  Property.getRelationList().then(function(res){
    //console.log(res);
    $scope.listaRelaciones = res.relaciones;
    //console.log($scope.listaRelaciones);
  }).catch(function(err){

  });
  $scope.registerPropertyToUser = function(){
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
    if(!angular.isUndefined(localStorageService.get('user.id'))){
      $scope.formdata.userId = localStorageService.get('user.id');
      Property.addProperty($scope.formdata).then(function(response){
        $rootScope.propiedadActiva = response.propertyId;
        localStorageService.set('user.propiedadActiva', $rootScope.propiedadActiva);
        $state.go('app.home', {fetch : true});
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

.controller('ChangePasswordCtrl', function($rootScope, $scope, $ionicLoading, $state, $stateParams, $timeout, capitalizeFilter, localStorageService, User){
  var userId = localStorageService.get('user.id');
  var eltimer = $timeout(function(){
    $ionicLoading.hide();
  }, 10000);
  $scope.formdata = {};
  $scope.confirmaCambio = function(){
    $ionicLoading.show({
      template: 'Enviando formulario...'
    });
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
    $scope.formdata.user_id = userId;
    User.cambiaPassword($scope.formdata).then(function(res){
      $ionicLoading.hide();
      $state.go('app.home');
      $rootScope.tituloModal = 'Formulario enviado';
      $rootScope.textoModal = res.msg;
      $rootScope.openModal();
    }).catch(function(err){
      console.log(err);
      $ionicLoading.hide();
      $rootScope.tituloModal = 'Error';
      $rootScope.textoModal = err.err;
      $rootScope.openModal();
    });
  }
  $scope.$on('$ionicView.beforeEnter', function(){

  });
})

.controller('EditaCuentaCtrl', function($rootScope, $scope, $ionicLoading, $state, $stateParams, $timeout, capitalizeFilter, localStorageService, User){
  var userId = localStorageService.get('user.id');
  var eltimer = $timeout(function(){
    $ionicLoading.hide();
  }, 10000);
  $scope.formdata = {};
  $scope.fetchUser = function($cache){
    User.fetchMeTheUser(userId, $cache).then(function(response){
      $rootScope.sesionUsuario = response.sesionUsuario;
      $scope.formdata.rut = response.sesionUsuario.rut;
      $scope.formdata.contact_name = response.sesionUsuario.contact_name;
      $scope.formdata.email = response.sesionUsuario.email;
      $scope.formdata.telephone = response.sesionUsuario.telephone;
      console.log("La Sesion del usuario de la wea de la wea: ", $rootScope.sesionUsuario);
    }).catch(function(err){
      console.log('Error en Usuario', err);
    }).finally(function(){
      $ionicLoading.hide();
    });
  }
  $scope.editarCuenta = function(){
    $ionicLoading.show({
      template: 'Enviando formulario...'
    });
    $scope.formdata.user_id = userId;
    User.editarCuenta($scope.formdata).then(function(res){
      $ionicLoading.hide();
      $state.go('app.home');
      $rootScope.tituloModal = 'Formulario enviado';
      $rootScope.textoModal = res.msg;
      $rootScope.openModal();
    }).catch(function(err){
      console.log(err);
      $ionicLoading.hide();
      $state.go('app.home');
      $rootScope.tituloModal = 'Error';
      $rootScope.textoModal = err.err;
      $rootScope.openModal();
    });
  }

  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.fetchUser(true);
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
  });

})
.controller('ConsumoCtrl', function($rootScope, $scope, $ionicLoading, $state, $stateParams, $timeout, capitalizeFilter, GraficoCuenta, User, Property, localStorageService){
  $scope.cargando = true;
  var userId = localStorageService.get('user.id');
  var devRegistrado = localStorageService.get('device.registered');
  var eltimer = $timeout(function(){
    $ionicLoading.hide();
  }, 10000);

  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.fetchUser(true);
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
  });
  if(devRegistrado == 0){
    $rootScope.registraDispositivo();
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
            animationEnabled: false,
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



.controller('ResumenCtrl', function($rootScope, $scope, $ionicLoading, $state, $stateParams, $timeout, capitalizeFilter, GraficoCuenta, User, Property, Pago, localStorageService){
    $scope.cargando = true;
    var userId = localStorageService.get('user.id');
    var devRegistrado = localStorageService.get('device.registered');
    var eltimer = $timeout(function(){
      $ionicLoading.hide();
      //console.log('timeout');
    }, 10000);
    $scope.$on('$ionicView.beforeEnter', function(){
	    $scope.fetchUser(false);
	    $ionicLoading.show({
        template: 'Consultando Información...'
      });
    });
    if(devRegistrado == 0){
      $rootScope.registraDispositivo();
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
            $rootScope.propiedadPortada.nickname = respuesta.detalle.Property.property_nickname;
			      //console.log('Propiedad de Portada: ', respuesta);
			    }).catch(function(error){
			      //console.log('Error en Propiedad', error);
			    }).finally(function(){
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
  $scope.listadocumentos = [];
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
    Property.getDueDocuments($stateParams.propertyId).then(function(respuesta){
      //console.log('La Respuesta', respuesta);
      $scope.cuenta.detalle = respuesta.detalle.details;
      $scope.cuenta.documentos = respuesta.detalle.unpaid;
      $scope.saldoTotal = 0;
      $scope.seleccionados = 0;
      angular.forEach($scope.cuenta.documentos, function(value, key) {
        $scope.cuenta.documentos[key].seleccionado = false;
      })
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
          console.log("El usuario: ", $rootScope.sesionUsuario);
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
    $state.go('app.home', {fetch : true}, {location: false, inherit:false, reload:false});
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
      $state.go('app.home', {fetch : true}, {location: false, inherit:false, reload:false});
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
  $scope.fallas = [
      {
          "descripcion": "Alza o baja de voltaje",
          "id": 1
      },
      {
          "descripcion": "Caída de Árbol o ramas en las líneas",
          "id": 2
      },
      {
          "descripcion": "Incendio",
          "id": 3
      },
      {
          "descripcion": "Líneas cortadas",
          "id": 4
      },
      {
          "descripcion": "Poste Chocado",
          "id": 5
      },
      {
          "descripcion": "Sin suministro",
          "id": 6
      }
  ];
  $scope.empresas = [];
  $scope.empresas[22] = {
      "idEmpresa" : 22,
      "numeroTelefono" : "600 4012021",
      "clickeable" : "tel:6004012020",
      "empresa" : "Frontel"
  };
  $scope.empresas[39] = {
      "idEmpresa" : 39,
      "numeroTelefono" : "600 4012020",
      "clickeable" : "tel:6004012020",
      "empresa" : "Luz Osorno"
  };
  $scope.empresas[23] = {
      "idEmpresa" : 23,
      "numeroTelefono" : "600 4012020",
      "clickeable" : "tel:6004012020",
      "empresa" : "Saesa"
  };
  $scope.empresas[24] = {
      "idEmpresa" : 24,
      "numeroTelefono" : "600 4012022",
      "clickeable" : "tel:6004012022",
      "empresa" : "Edelaysen"
  };
  $scope.propiedades = $rootScope.sesionUsuario.Propiedades;
  $scope.formdata = [];
  $scope.activa = $scope.empresas[23];
  $scope.formdata.propiedad = -1;
  $scope.formdata.tipofalla = -1;
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
    Fallas.lasFallas().then(function(response){
      $scope.fallas = [];
      angular.forEach(response.fallas, function(value, key){
        var lafalla = {
          "descripcion" : value.descripcion,
          "id" : parseInt(value.idFalla, 10)
        };
        $scope.fallas.push(lafalla);
      });
      //console.log("Las pifias", response);
    }).catch(function(err){
      //console.log(err);
    }).finally(function(){
      $ionicLoading.hide();
    });
  });

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
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation:true,
        targetWidth: 1920,
        targetHeight: 1080
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
    //console.log("Formulario Falla: ", falla);
    Fallas.reportarFalla(falla).then(function(res){
      //console.log(res);
      $ionicLoading.hide();
      $state.go('app.home');
      $rootScope.tituloModal = 'Formulario enviado';
      $rootScope.textoModal = 'Se ha enviado su informe de falla';
      $rootScope.openModal();
    }).catch(function(err){
      //console.log(err);
      $ionicLoading.hide();
      $state.go('app.home');
      $rootScope.tituloModal = 'Error';
      $rootScope.textoModal = err.mensaje;
      $rootScope.openModal();
    }).finally(function(ble){
      //console.log(ble);
    });
  }
})

.controller('OficinasCtrl', function($scope, $rootScope, $ionicHistory, $ionicLoading, $log, Oficinas) {
  $scope.oficinas = [];
  $scope.regiones = [];
  $scope.comunas = [];
  $scope.validaComunas = [];
  $scope.filtrosOficinas = [];
  $scope.buscarOficina = {
    nombreComuna: ""
  };
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
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
      $ionicLoading.hide();
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

.controller('NotificacionesCtrl', function($scope, $rootScope, $ionicHistory, $ionicLoading, Notificaciones, localStorageService) {
  $scope.notificaciones = [];
  $scope.$on('$ionicView.beforeEnter', function(){
    $ionicLoading.show({
      template: 'Consultando Información...'
    });
    Notificaciones.getNotificaciones($rootScope.sesionUsuario.id).then(function(res){
      angular.forEach(res, function(v, k){
        var estadoNotificacion = localStorageService.get('notificaciones.leidas.' + v.Notification.remote_id);
        if(angular.isUndefined(estadoNotificacion) || estadoNotificacion == null){
          if(v.Notification.type == 'retail'){
            v.Notification.prioridad = 'alta';
          }else{
            v.Notification.prioridad = 'media';
          }
        }else{
          v.Notification.prioridad = 'leida';
        }
        $scope.notificaciones.push(v.Notification)
      });
    }).catch(function(err){

    });
    $ionicLoading.hide();
  });
  $scope.marcarLeida = function(remote_id){
    localStorageService.set('notificaciones.leidas.' + remote_id, 1);
    angular.forEach($scope.notificaciones, function(v, k){
      if(v.remote_id == remote_id){
        $scope.notificaciones[k].prioridad = 'leida';
      }
    });
  };
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
      idEmpresa: $scope.propiedades[$scope.formdata.propiedad].related_enterprise,
      idServicio: $scope.propiedades[$scope.formdata.propiedad].client_number,
      comentarios: $scope.formdata.comentarios
    };
    //console.log(cntacto);
    Contacto.enviaContacto(cntacto).then(function(res){
      //console.log(res);
      $ionicLoading.hide();
      $state.go('app.home');
      $rootScope.tituloModal = 'Contacto Enviado';
      $rootScope.textoModal = 'Se ha enviado su consulta';
      $rootScope.openModal();
    }).catch(function(err){
      //console.log(err);
      $ionicLoading.hide();
      $state.go('app.home');
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
.controller('LoginCtrl', function($scope, $state, ngRut, User, localStorageService, $rootScope, $ionicModal){
  $scope.formdata = {};

  $rootScope.modal = $ionicModal.fromTemplateUrl('templates/modal-test.html', {
    scope: $rootScope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $rootScope.modal = modal;
  });

  $rootScope.registraDispositivo = function(){
    var registrado = localStorageService.get('device.registered');
    var deviceKey =  localStorageService.get('device.registrationId');
    var operativeSystem = localStorageService.get('device.os');
    if(registrado == 0){
      var data = {
        deviceKey: deviceKey,
        userId: $rootScope.sesionUsuario.id,
        operativeSystem: operativeSystem
      };
      User.registraDispositivo(data).then(function(res){
        localStorageService.set('device.registered', 1);
      }).catch(function(err){
        //console.log("El Error", err);
      });
    }
  }


  $rootScope.openModal = function() {
    $rootScope.modal.show();
  };

  $rootScope.closeModal = function() {
    $rootScope.modal.hide();
  };

  $scope.formatRut = function(rut){
    return ngRut.format(rut);
  }

  $scope.doLogin = function() {
    //console.log('Doing login', $scope.formdata);
    $scope.formdata.rut = ngRut.clean($scope.formdata.rut);
    User.login($scope.formdata).then(function(response){
      if(response.idUsuario != null){
        localStorageService.set('user.id', response.idUsuario);
        $rootScope.registraDispositivo();
        $state.go('app.home');
      }
    }).catch(function(error){
      //console.log('Error: ', error);
      /** Levantamos modal con mensajes de error **/
        var labelError = '';
        $rootScope.tituloModal = 'Ha ocurrido un error';
        if(error.err.data.res != null && angular.isDefined(error.err.data.res)){
          labelError = error.err.data.res;
        }else{
          labelError = "Ha ocurrido un error al procesar la información, para mayor información contactese con nosotros";
        }
        $rootScope.textoModal = labelError;
        $rootScope.openModal();
        $scope.formdata.rut = ngRut.format($scope.formdata.rut);
    });
  };
})


/*MARCELOSHET RELOAD*/


.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('ti-back-left');
})
;
