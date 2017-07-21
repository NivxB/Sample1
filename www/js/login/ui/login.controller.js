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
		'$http'
	];


	function loginController($scope, $state, $ionicPopup, LayoutFactory, smartphoneServ, logonService, i18translate, $filter, $cordovaDevice, memento, sessionTimerService, $window, $rootScope, fingerPrintAuth, keysStorage,$http) {
		LayoutFactory.showHeaderBarBtn(true);

		var config = {
			headers: {
				'Accept': 'application/json'
			}
		};
		
		$scope.municipios = "";

		$scope.callBackend = function () {
			$http.get("http://192.168.30.197:3000/api/Municipios", config).then(function (response) {
				$scope.municipios = response;
			}, function (response) {
				console.log(response);
			});
		};
	};

})();
