(function () {
	'use strict';

	var loginModule = angular.module('loginModule');
	loginModule.controller('loginController', loginController);

	loginController.$inject = [
		'$scope',
		'$state',
		'$ionicPopup',
		'LayoutFactory',
		'smartphoneServ',
		'logonService',
		'i18translate',
		'$filter',
		'$cordovaDevice',
		'memento',
		'sessionTimerService',
		'$window',
        '$rootScope',
		'fingerPrintAuth',
		'keysStorage',
		'$http',
		'$timeout'
	];


	function loginController($scope, $state, $ionicPopup, LayoutFactory, smartphoneServ, logonService, i18translate, $filter, $cordovaDevice, memento, sessionTimerService, $window, $rootScope, fingerPrintAuth, keysStorage,$http,$timeout) {
		LayoutFactory.showHeaderBarBtn(false);
		LayoutFactory.showHeader(false);
		$scope.lastBackground = 0;

		$scope.backgrounds = [{
			'image':'img/login/fondo.png'
		},{
			'image':'img/login/fondo2.png'
		}]

		$scope.socialLogin = [{
			title:"Facebook",
			logo: "img/login/facebook.svg",
			login: function(){
				console.log("FB");
			}
		},{
			title:"Google",
			logo: "img/login/google.svg",
			login: function(){
				console.log("GG");
			}
		}]
		$scope.init = function(){
			function anim() {
				if ($scope.lastBackground > 0){
					$scope.backgrounds[$scope.lastBackground-1].isVisible = false;
				}else{
					$scope.backgrounds[$scope.backgrounds.length-1].isVisible = false;
				}
				$scope.backgrounds[$scope.lastBackground].isVisible = true;
				$scope.lastBackground++;
				$scope.lastBackground = $scope.lastBackground%$scope.backgrounds.length;

			   	$timeout(anim, 5000);
			}
			anim();
		}

		$scope.createAccount = function(){
			console.log("createAccount");
		}

		$scope.signInLocal = function(){
			console.log("signUpLocal");
		}

		$scope.information = function(){
			console.log("information")
		}

		$scope.init();
	};

})();
