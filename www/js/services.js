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