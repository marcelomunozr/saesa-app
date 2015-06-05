
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
;