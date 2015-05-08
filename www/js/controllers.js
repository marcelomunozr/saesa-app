
angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
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
  var maxAccounts = 100;  
  var i = 1;  
  $scope.addAcount = function() { 
    if(i < maxAccounts){
        i++;
        jQuery(".input_fields_wrap").append('<div class="row"><div class="col col-75"><label class="item item-input"><input type="text" name="account['+i+']" placeholder="Agregar Cuenta"/><a href="#" ng-click="removeAccount()">Eliminar</a></label></div><div class="col">?</div></div>');
        console.log(i);
    }
  
    $scope.removeAccount = function(){
      jQuery(this).parent('.item-input').remove();
      i--;
      console.log(i);
    }

  }





})


  
