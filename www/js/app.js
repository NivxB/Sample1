(function () {
	require([
		//Sap Backend Services
		'lib/angular-translate/angular-translate.min.js',
		'lib/angular-animate/angular-animate.min.js',
		'./js/generalServices/sap.factory.js',
		'./js/generalServices/secureStorage.factory.js',
		'./js/generalServices/storageManager.factory.js',
		'./js/generalServices/fingerPrint.factory.js',
		'./js/translations/translations.provider.js',
		//Logon services
		'./js/generalServices/logon.factory.js',
		//Router
		'./js/ui-router/ionic-router.provider.js',
		//Layout Module, Controller and Styles
		/*'./js/layout/ui/layout.module.js',*/
		'./js/layout/ui/layout.controller.js',
		'css!js/layout/ui/css/layout.min.css',
		// Login
		'./js/login/ui/login.module.js',
		'./js/generalServices/sessionTimer.factory.js',
        './js/quickaction.service.js'
	],
	function () {
		// Ionic Starter App

		// angular.module is a global place for creating, registering and retrieving Angular modules
		// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
		// the 2nd parameter is an array of 'requires'
		var start = angular.module('startModule', [
			'ionic',
			'routing',
			'layoutModule',
			'logon',
			'storageManager',
			'loginModule',
			'ngCordova',
			'uuid4',
			'pascalprecht.translate',
			'translations',
			'sessionTimerModule',
            'QuickActionServiceModule',
			'fingerPrintModule',
			'securityManager'
		]);

		start.config(function ($locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
			start.controller = $controllerProvider.register;
			start.directive = $compileProvider.directive;
			start.filter = $filterProvider.register;
			start.factory = $provide.factory;
			start.service = $provide.service;
		});

		start.run(function ($ionicPlatform, routingSetter, $state, memento, QuickActionService, fingerPrintAuth,memento,logonService) {
			$ionicPlatform.ready(function () {
				logonService.loadConfiguration();
				fingerPrintAuth.prepare();
				memento.openLocalDatabase();
				$ionicPlatform.registerBackButtonAction(function(event) {
					console.log($state.current.name);
					if($state.current.name == 'login'){
						navigator.app.exitApp();
					}else{
						$state.goBack();
					}
				}, 100);
				if (window.cordova && window.cordova.plugins.Keyboard) {
					// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
					// for form inputs)
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);

					// Don't remove this line unless you know what you are doing. It stops the viewport
					// from snapping when text inputs are focused. Ionic handles this internally for
					// a much nicer keyboard experience.
					cordova.plugins.Keyboard.disableScroll(true);
				}
				if (window.StatusBar) {
					StatusBar.styleDefault();
				}

                QuickActionService.configure();

				$state.transitionTo('abstAbt.login');
			});
		});
		angular.bootstrap(document, ['startModule']);
	})
})();
