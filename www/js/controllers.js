
angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $sce, $compile) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalLogin = modal;
    $scope.modalLogin.show();
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modalLogin.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modalLogin.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  //modal register
  $scope.closeRegister = function() {
    $scope.modalRegister.hide();
  };
  $scope.register= function(){
    $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modalRegister = modal;
      $scope.modalRegister.show();
    });
  }
  //modal forgot password
  $scope.closeForgot = function() {
    $scope.modalForgot.hide();
  };
  $scope.forgotPassword= function(){
    $ionicModal.fromTemplateUrl('templates/forgot-password.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modalForgot = modal;
      $scope.modalForgot.show();
    });
  }

  //register effects
  $scope.nextRegister = function() {
    jQuery("li.one").removeClass("active");
    jQuery("li.two").addClass("active");
    jQuery(".registerForm1").hide();
    jQuery(".registerForm2").fadeIn(300);
  };


  //add account




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