(function () {
	'use strict';

	var itSelf = angular.module('layoutModule', []);
	itSelf.factory('LayoutFactory', LayoutFactory);

	function LayoutFactory() {
		var fct = {};
		return fct;
	};

	itSelf.controller('layoutController', layoutController);

	layoutController.$inject = [
		'$scope',
		'LayoutFactory',
		'$state',
		'$ionicLoading',
		'logonService',
		'smartphoneServ',
		'sessionTimerService',
		'$ionicPopup',
		'$filter',
		'routingSetter'
	];

	function layoutController($scope, LayoutFactory, $state, $ionicLoading, logonService, smartphoneServ, sessionTimerService, $ionicPopup,$filter,routingSetter) {
		$scope.loading = false;
		$scope.showMenuBtn = false;
		$scope.showNotificaonsBtn = false;
		$scope.disabledDrag = true;
		$scope.showLayoutHeader = true;


		var showMenuButton = function (flag) {
			$scope.showMenuBtn = flag;
		};


		$scope.closeSession = function () {
			var sessionInfo = logonService.getCredentials();
			var objectToSend = {
				origin: "MAPP",
				sessionId: sessionInfo.sessionId
			};
			var callback = function (err, response) {
				LayoutFactory.toggleLoading();
				if (err) {
					console.log(response);
				} else {
					if (response.data && response.data.Status) {
						var code = response.data.Status.code;
						switch (code) {
						case 0:
							logonService.setCredentials({});
							logonService.setActive(false);
							routingSetter.clearBackStack();
							$state.go('login');
							// Stop session timer
							sessionTimerService.stopSessionTimer();
							break;
						default:
							console.log(response);
						}
					}
				}
			};

			var myPopup = $ionicPopup.show({
				template: $filter('translate')('layout.CLOSE_SESSION'),
				title:  $filter('translate')('layout.CLOSE_SESSION_TITLE') ,
				buttons: [
					{
						text: $filter('translate')('general.CANCEL')
					},
					{
						text: $filter('translate')('transfers.ACCEPT'),
						type: 'button-positive',
						onTap: function (e) {
							LayoutFactory.toggleLoading();
							smartphoneServ.logout(objectToSend, callback);
						}
      				}
    			]
			});
		};


		var showNotificationBtn = function (flag) {
			$scope.showNotificaonsBtn = flag;
		};


		var showHeaderBarBtn = function (flag) {
			$scope.showMenuBtn = flag;
			$scope.showNotificaonsBtn = flag;
		};


		var disabledDragonMenu = function (flag) {
			$scope.disabledDrag = flag;
		};


		var toggleLoading = function () {
			if ($scope.loading) {
				$scope.hide();
			} else {
				$scope.show();
			}
			$scope.loading = !$scope.loading;
		};

		var showHeader = function(flag){
			$scope.showLayoutHeader = flag;
		}

		$scope.show = function () {
			$ionicLoading.show({
				template: '<ion-spinner icon="spiral"></ion-spinner>'
			}).then(function () {
				//console.log("The loading indicator is now displayed");
			});
		};


		$scope.hide = function () {
			$ionicLoading.hide().then(function () {
				//console.log("The loading indicator is now hidden");
			});
		};


		LayoutFactory.showNotificaonsBtn = showNotificationBtn;
		LayoutFactory.showMenuButton = showMenuButton;
		LayoutFactory.showHeaderBarBtn = showHeaderBarBtn;
		LayoutFactory.disabledDragOnMenu = disabledDragonMenu;
		LayoutFactory.toggleLoading = toggleLoading;
		LayoutFactory.showHeader = showHeader;
	};


})();
