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

<<<<<<< HEAD
.factory('User', function($http, $q, laConfig){
  var esto = this;

  esto.login = function($data){
    var res = $q.defer();
    $http({
      method: 'POST',
      url: laConfig.backend + 'login.json',
      data: $data
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
      res.reject({
        reason: 'error',
        err: err
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
      url: laConfig.backend + 'register.json',
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
      res.reject({
        reason: 'error',
        err: err
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
  esto.addProperty = function($data){
    var res = $q.defer();
    var datos = {
      idUsuario : $data.razonSocial,
      numCliente :  $data.numCliente,
      codEmpresa : $data.codEmpresa,
      numBoleta : $data.numBoleta,
      relPropiedad : $data.relPropiedad,
      nomPropiedad : $data.nomPropiedad
    };
    $http({
      method: 'POST',
      url: laConfig.backend + 'addProperty.json',
      data: datos
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
      res.reject({
        reason: 'error',
        err: err
      });
    });
    return res.promise;
  }

  return esto;
})



=======
.factory('Login', function() {
  var user = [
      {
        id: "1",
        RutContacto: "1-9", 
        PasswordContacto: "multinet666"
      },
      {
        id: "2",
        RutContacto: "123-k", 
        PasswordContacto: "multinet666"
      }
  ];
  return {
    all: function() {
      return user;
    },
    get: function(loginId) {
      for (var i = 0; i < user.length; i++) {
        if (user[i].id === parseInt(loginId)) {
          console.log("datos",user[i]);
          return user[i];
        }
      }
      return null;
    }
  };
})

.factory('ResumenCuenta', function(){
  
})

.factory('ServiciosAsociados', function() {
  var datos = [
      {
        id: "1",
        servicio: "Mi casa", 
        info: "La propiedad ubicada en Santos Dumont 190, comuna de Recoleta, se encuentra con corte desde el 17 de agosto por no pago.", 
        estado: "vencida"
      },
      {
        id: "2",
        servicio: "Casa campo", 
        info: "La propiedad ubicada en Santos Dumont 190, comuna de Recoleta, se encuentra con corte desde el 17 de agosto por no pago.", 
        estado: ""
      },
      {
        id: "3",
        servicio: "Casa de verano", 
        info: "La propiedad ubicada en Santos Dumont 190, comuna de Recoleta, se encuentra con corte desde el 17 de agosto por no pago.", 
        estado: "por-vencer"
      }
  ];
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
>>>>>>> c936ec63af8867c22ce8aa22e599fe2e40060f17

.factory('Oficinas', function() {
  var datos = [
    {
      id: 1,
      zona: "osorno",
      nombreZona: "OSORNO",
      direccion: "Eleuterio Ramírez N° 705",
      horario: "Lunes a viernes 8:00 a 16:00 hrs.",
      latitud: "-40.5730256",
      longitud: "-73.13853890000001"
    },
    {
      id: 2,
      zona: "osorno",
      nombreZona: "OSORNO (Rahue)",
      direccion: "Victoria N° 380",
      horario: "Lunes a viernes 8:00 a 16:00 hrs.",
      latitud: "-40.572501",
      longitud: "-73.1579049"
    }
  ];
  return {
    all: function() {
      return datos;
    },
    get: function(oficinaId) {
      for (var i = 0; i < datos.length; i++) {
        if (datos[i].id === parseInt(oficinaId)) {
          console.log("datos",datos[i]);
          return datos[i];
        }
      }
      return null;
    }
  };
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