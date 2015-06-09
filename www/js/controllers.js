
angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $sce, $compile) {
  // Form data for the login modal
  $scope.loginData = {};



  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };



})
.controller('RegisterCtrl', function($scope) {
	$scope.regdata = {};
	console.log('paso', $scope.regdata);
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
.controller('ResumenCtrl', function($scope){
    CanvasJS.addColorSet("colorCol",
      [//color
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
      title:{
        text: "Cuadro Comparativo"
      
      },
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

;