angular.module('starter.services', [])
.directive('angularCompile', function($compile) {
	return function(scope, element, attrs) {
	    scope.$watch(
	        function(scope) {
	            return scope.$eval(attrs.angularCompile);
	        },
	        function(value) {
	            $compile(element.contents())(scope);
	        }
	    );
	};
})


.factory('User', function($http, $q, laConfig){
  var esto = this;
  esto.login = function($data){
    var res = $q.defer();
    $http({
      method: 'POST',
      url: laConfig.backend + 'login',
      data: {
        RutContacto: $data.rut,
        PasswordContacto: $data.password
      }
    }).success(function(response){
      if(response === false){
        res.reject({
          reason: 'no',
          message: 'ingreso incorrecto.'
        });
      } else {
        console.log('Respuesta desde servidor:',response);
        res.resolve(response);
      }
    }).catch(function(err){
      var error = (err.data != null) ? err.data.msg : err;
      res.reject({
        reason: 'error',
        err: error
      });
    });
    return res.promise;
  }

  esto.register = function($data){
    var res = $q.defer();
    var datos = {
      RazonSocial : $data.razonSocial,
      RutContacto :  $data.rutContacto,
      NombreContacto : $data.nombreContacto,
      EmailContacto : $data.emailContacto,
      TelefonoContacto : $data.telefonoContacto,
      PasswordContacto : $data.passwordContacto,
      RepetirPassword : $data.passwordRepetir
    };
    $http({
      method: 'POST',
      url: laConfig.backend + 'register',
      data: datos
    }).success(function(response){
      if(response === false){
        res.reject({
          reason: 'no',
          message: 'registro incorrecto.'
        });
      } else {
        console.log('Respuesta desde servidor:',response);
        res.resolve(response);
      }
    }).catch(function(err){
      var error = (err.data != null) ? err.data.msg : err;
      res.reject({
        reason: 'error',
        err: error
      });
    });
    return res.promise;
  }

  esto.fetchMeTheUser = function($data){
    var res = $q.defer();
    var url = laConfig.backend + 'getUser/' + $data;
    $http.get(url, {
      cache: true,
      timeout: 30000
    }).success(function(response){
      if(response === false){
        res.reject({
          reason: 'no',
          message: 'no info.'
        });
      } else {
        console.log('Respuesta desde servidor:',response);
        res.resolve(response);
      }
    }).catch(function(err){
      var error = (err.data != null) ? err.data.msg : err;
      res.reject({
        reason: 'error',
        err: error
      });
    });
    return res.promise;
  }

  esto.forgotPassword = function($data){
    var res = $q.defer();
    var url = laConfig.backend + 'recuperarPassword';
    var datos = {
      rut: $data
    }
    $http.post(url, datos, {
      timeout: 30000
    }).success(function(response){
      if(response === false){
        res.reject({
          reason: 'no',
          message: 'no info.'
        });
      } else {
        console.log('Respuesta desde servidor:',response);
        res.resolve(response);
      }
    }).catch(function(err){
      var error = (err.data != null) ? err.data.msg : err;
      res.reject({
        reason: 'error',
        err: error
      });
    });
    return res.promise;
  }
  return esto;
})

.factory('Property', function($http, $q, laConfig) {
  /**
  * Reune las funciones de el servicio (detalle, agregar, etc)
  */
  var esto = this;
  esto.getDetails = function($data){
    var res = $q.defer();
    var url = laConfig.backend + 'getPropertyExtraData/' + $data; 
    $http.get(url, {
      cache: true,
      timeout: 30000
    }).success(function(response){
      if(response === false){
        res.reject({
          reason: 'no',
          message: 'propiedad no agregada.'
        });
      } else {
        console.log('Respuesta desde servidor:',response);
        res.resolve(response);
      }
    }).catch(function(err){
      console.log('El Error', err);
      var error = (err.data == null) ? err : err.data.msg; 
      res.reject({
        reason: 'error',
        err: error
      });
    });
    return res.promise;
  }

  esto.getDueDocuments = function($data){
    var res = $q.defer();
    var url = laConfig.backend + 'getDueDocuments/' + $data; 
    $http.get(url, {
      cache: true,
      timeout: 30000
    }).success(function(response){
      if(response === false){
        res.reject({
          reason: 'no',
          message: 'propiedad no agregada.'
        });
      } else {
        console.log('Respuesta desde servidor:',response);
        res.resolve(response);
      }
    }).catch(function(err){
      console.log('El Error', err);
      var error = (err.data == null) ? err : err.data.msg; 
      res.reject({
        reason: 'error',
        err: error
      });
    });
    return res.promise;
  }

  esto.addProperty = function($data){
    var res = $q.defer();
    var datos = {
      idUsuario : $data.userId,
      numCliente :  $data.numCliente,
      codEmpresa : $data.codEmpresa,
      numBoleta : $data.numBoleta,
      relPropiedad : $data.relPropiedad,
      nomPropiedad : $data.nomPropiedad
    };
    $http({
      method: 'POST',
      url: laConfig.backend + 'addProperty',
      data: datos,
      timeout: 30000
    }).success(function(response){
      if(response === false){
        res.reject({
          reason: 'no',
          message: 'propiedad no agregada.'
        });
      } else {
        console.log('Respuesta desde servidor:',response);
        res.resolve(response);
      }
    }).catch(function(err){
      console.log('El Error', err);
      var error = (err.data == null) ? err : err.data.msg; 
      res.reject({
        reason: 'error',
        err: error
      });
    });
    return res.promise;
  }
  return esto;
})


.factory('GraficoCuenta', function(){
  var labels = [
      "ENE",
      "FEB",
      "MAR",
      "ABR",
      "MAY",
      "JUN", 
      "JUL",
      "AGO",
      "SEP",
      "OCT",
      "NOV",
      "DIC"]

  var datos = [
    {        
      type: "column",
      showInLegend: false,
      dataPoints: [
      { label: "ENE", y: 120 },
      { label: "FEB", y: 60 },
      { label: "MAR", y: 90 },
      { label: "ABR", y: 70 },
      { label: "MAY", y: 110 },
      { label: "JUN", y: 100 },
      { label: "JUL", y: 50 },
      { label: "AGO", y: 70 },
      { label: "SEP", y: 80 },
      { label: "OCT", y: 60 },
      { label: "NOV", y: 90 },
      { label: "DIC", y: 110 }
      ]
    },
    {        
      type: "line",
      dataPoints: [
      { label: "ENE", y: 100 },
      { label: "FEB", y: 80 },
      { label: "MAR", y: 60 },
      { label: "ABR", y: 90 },
      { label: "MAY", y: 50 }/*,
      { label: "JUN", y: 60 },
      { label: "JUL", y: 90 },
      { label: "AGO", y: 70 },
      { label: "SEP", y: 110 },
      { label: "OCT", y: 100 },
      { label: "NOV", y: 70 },
      { label: "DIC", y: 90 }*/
      ]
    }        
    ];
  return {
    all: function() {
      return datos;
    },
    get: function(graficoId) {
      for (var i = 0; i < datos.length; i++) {
        if (datos[i].id === parseInt(graficoId)) {
          console.log("datos",datos[i]);
          return datos[i];
        }
      }
      return null;
    },
    transformDatos: function($data){
      var actualFecha = new Date();
      var actualMes = actualFecha.getMonth();
      
      var graphData = [{
        type: "column",
        showInLegend: false,
        dataPoints:[]
      }, {
        type: "line",
        dataPoints: []
      }];
      angular.forEach($data, function(objeto, llave){
        var mes = parseInt(objeto.mes);
        var puntoA = {
          label: labels[mes],
          y: parseInt(objeto.anoAnterior)
        };
        if(actualMes > llave){
          var puntoB = {
            label: labels[mes],
            y: parseInt(objeto.anoActual)
          }
        }else{
          if(objeto.anoActual > 0){
            var puntoB = {
              label: labels[mes],
              y: parseInt(objeto.anoActual)
            }
          }else{
            var puntoB = {
              label: labels[mes],
              y: null
            }
          }
        }
        graphData[0].dataPoints.push(puntoA);
        graphData[1].dataPoints.push(puntoB);
      });
      return graphData;
    }
  };
})

.factory('ServiciosAsociados', function() {
  return {
    all: function() {
      return datos;
    },
    get: function(servicioId) {
      for (var i = 0; i < datos.length; i++) {
        if (datos[i].id === parseInt(servicioId)) {
          console.log("datos",datos[i]);
          return datos[i];
        }
      }
      return null;
    }
  };
})


.factory('Oficinas', function($http, $q, laConfig) {
  var datos = [];
  var esto = this;
  esto.get = function(oficinaId){
    var resultado = [];
    var res = $q.defer();
    if(datos.length > 0){
      angular.forEach(datos, function(value, key){
        if(value.id === parseInt(oficinaId)) {
          res.resolve(value);
        }
      });
    }else{
      esto.all().then(function(response){
        if(response.length < 0){
          res.reject({
            reason: 'no',
            message: 'propiedad no agregada.'
          });
        }else{
          datos = response.oficinas;
        }
      }).catch(function(err){
        res.reject({
          reason: 'no',
          message: 'propiedad no agregada.'
        });
      }).finally(function(){
        angular.forEach(datos, function(value, key){
          if(value.id === parseInt(oficinaId)) {
            res.resolve(value);
          }
        });
      });
    }
    return res.promise;
  }

  esto.all = function(){
    var res = $q.defer();
    var url = laConfig.backend + 'getOficinas'; 
    $http.get(url, {
      cache: true,
      timeout: 30000
    }).success(function(response){
      if(response === false){
        res.reject({
          reason: 'no',
          message: 'propiedad no agregada.'
        });
      } else {
        console.log('Respuesta desde servidor:',response);
        res.resolve(response);
        datos = response.oficinas;
      }
    }).catch(function(err){
      console.log('El Error', err);
      var error = (err.data == null) ? err : err.data.msg; 
      res.reject({
        reason: 'error',
        err: error
      });
    });
    return res.promise;
  }
  return esto;
})

.factory('Notificaciones', function() {
  var datos = [
    {
      id: 1,
      prioridad: "media",//media y alta
      estado: "nueva",
      contenido: "Tienes una deuda con la propiedad Santos Dumont 190."
    },
    {
      id: 2,
      prioridad: "alta",//media y alta
      estado: "nueva",
      contenido: "Corte programado para el día 18 agosto 20:00, propiedad Av. Providencia 1870, reposición en caso de pago en 24 horas."
    },
    {
      id: 3,
      prioridad: "alta",//media y alta
      estado: "leida",
      contenido: "Corte programado para el día 18 agosto 20:00, propiedad Av. Providencia 1870, reposición en caso de pago en 24 horas."
    },
    {
      id: 4,
      prioridad: "alta",//media y alta
      estado: "leida",
      contenido: "Tienes una deuda con la propiedad Santos Dumont 190."
    },
    {
      id: 5,
      prioridad: "alta",//media y alta
      estado: "leida",
      contenido: "Corte programado para el día 18 agosto 20:00, propiedad Av. Providencia 1870, reposición en caso de pago en 24 horas."
    }
  ];
  return {
    all: function() {
      return datos;
    },
    get: function(notificacionId) {
      for (var i = 0; i < datos.length;) {
        if (datos[i].id === parseInt(notificacionId)) {
          console.log("datos",datos[i]);
          return datos[i];
        }
      }
      return null;
    }
  };
})

.factory('Fallas', function(){
  var esto = this;
  var fallas = [
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
  esto.lasFallas = function(){
    return fallas;
  }
  return esto;

})

.factory('DocumentosImpagos', function() {
  var datos = [
    {
      id: 1,
      prioridad: "media",//media y alta
      estado: "nueva",
      contenido: "Tienes una deuda con la propiedad Santos Dumont 190."
    },
    {
      id: 2,
      prioridad: "alta",//media y alta
      estado: "nueva",
      contenido: "Corte programado para el día 18 agosto 20:00, propiedad Av. Providencia 1870, reposición en caso de pago en 24 horas."
    },
    {
      id: 3,
      prioridad: "alta",//media y alta
      estado: "leida",
      contenido: "Corte programado para el día 18 agosto 20:00, propiedad Av. Providencia 1870, reposición en caso de pago en 24 horas."
    },
    {
      id: 4,
      prioridad: "alta",//media y alta
      estado: "leida",
      contenido: "Tienes una deuda con la propiedad Santos Dumont 190."
    },
    {
      id: 5,
      prioridad: "alta",//media y alta
      estado: "leida",
      contenido: "Corte programado para el día 18 agosto 20:00, propiedad Av. Providencia 1870, reposición en caso de pago en 24 horas."
    }
  ];
  return {
    all: function() {
      return datos;
    },
    get: function(documentoId) {
      for (var i = 0; i < datos.length;) {
        if (datos[i].id === parseInt(documentoId)) {
          console.log("datos",datos[i]);
          return datos[i];
        }
      }
      return null;
    }
  };
})

;