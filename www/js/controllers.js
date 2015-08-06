
angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, Login){
  $scope.user = Login.all();
})

.controller('RegisterCtrl', function($scope, $ionicHistory) {
	$scope.regdata = {};
	console.log('paso', $scope.regdata);
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
})


.controller('RegisterFormCtrl', function($scope, $sce, $compile){
	$scope.regdata.paso = 1;
	console.log('paso', $scope.regdata);
})


.controller('RegisterAddAccountCtrl', function($scope, $sce, $compile){
	console.log('paso', $scope.regdata);
	$scope.regdata.paso = 2;

	$scope.cuentas = [{
		'elinput' : $sce.trustAsHtml('<label class="item item-input"><input type="text" placeholder="Agregar Cuenta" name="account[]"></label>'),
		'ayuda' : true
	}];
	$scope.numCuentas = $scope.cuentas.length;

	var maxAccounts = 10;
	var i = 1;

	$scope.addAccount = function() {
		if(i <= maxAccounts){
			i++;
			console.log(i);
			$scope.cuentas.push({
				'elinput' : $sce.trustAsHtml('<label class="item item-input"><input type="text" placeholder="Agregar Cuenta" name="account[]"></label>')
			})
		}
	}
	$scope.removeAccount = function(index){
		i--;
    $scope.cuentas.splice(index,1);
		$scope.numCuentas = $scope.cuentas.length;

		console.log(i);
	}

})


.controller('AppCtrl', function($scope, $ionicHistory, $ionicModal, $timeout, $sce, $compile) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
})


.controller('ResumenCtrl', function($scope,$ionicHistory){
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    CanvasJS.addColorSet("colorCol",
      [
      "#d7e4ec",
      "#17c300"             
      ]
    );
    var chart = new CanvasJS.Chart("chartContainer",
    {
      animationEnabled: true,
      interactivityEnabled: false,
      backgroundColor: "#fcfcfc",
      colorSet: "colorCol",
      /*title:{
        text: "cuadro comparativo",
        fontFamily: "Tahoma",
        fontSize: 12,
        fontWeight: "normal"
      
      },*/
      dataPointMaxWidth: 12,
      height: 160,
      axisY:{
        maximum: 150
      },
      data: [{        
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
      ]
    });
    chart.render();
})

.controller('DocumentosImpagosCtrl', function($scope,$ionicHistory, DocumentosImpagos){
  $scope.documentos = DocumentosImpagos.all();
  $ionicHistory.nextViewOptions({
    disableBack: false
  });
})

.controller('AsociadosCtrl', function($scope, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, $rootScope,$ionicHistory, ServiciosAsociados){

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

.controller('FallaCtrl', function($scope){
  $('#for-file-upload').on("tap",function(){
    $('#file-upload').click();
  });
})


.controller('OficinasCtrl', function($scope,$ionicHistory, Oficinas) {
  $scope.oficinas = Oficinas.all();
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
})

.controller('OficinaCtrl', function($scope, $stateParams,$ionicHistory , Oficinas) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  $scope.oficina = Oficinas.get($stateParams.oficinaId);
  $scope.initialize = function() {
    var myLatlng = new google.maps.LatLng($scope.oficina.latitud,$scope.oficina.longitud);//-40.5730256 //-73.13853890000001
    
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
      title: 'Grupo Saesa'
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });

    $scope.map = map;
  }
  //google.maps.event.addDomListener(window, 'load', initialize);
})

.controller('NotificacionesCtrl', function($scope,$ionicHistory, Notificaciones) {
  $scope.notificaciones = Notificaciones.all();
  $ionicHistory.nextViewOptions({
    disableBack: false
  });
})
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('ion-ios7-arrow-left');
})

;