(function () {
	'use strict';

	var loginModule = angular.module('loginModule', ['sapServices'])
	loginModule.config(appConfig).run(appRun);

	appConfig.$inject = [
		'$locationProvider',
		'$controllerProvider',
		'$compileProvider',
		'$filterProvider',
		'$provide'
	];

	function appConfig($locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
		loginModule.controller = $controllerProvider.register;
		loginModule.directive = $compileProvider.directive;
		loginModule.filter = $filterProvider.register;
		loginModule.factory = $provide.factory;
		loginModule.service = $provide.service;
	};

	appRun.$inject = [
		'routingSetter',
		'i18translate'
	];


	function appRun(routingSetter, i18translate) {
		routingSetter.setStates(getStates());
		i18translate.setLanguages(getTranslations());
	};


	// definition of routes
	function getStates() {
		return [{
			state: 'abstAbt',
			config: {
				abstract: true,
				templateUrl: './js/layout/ui/layout.view.html'
			}
		}, {
			state: 'abstAbt.login',
			config: {
				title: 'Login',
				views: {
					// targets 'sidebar' ui-view in 'vc' state
					'main-content@abstAbt': {
						templateUrl: 'js/login/ui/login.view.html',
						dependencies: [
							'css!js/login/ui/css/login.min.css',
							'js/login/ui/login.controller.js'
						]
					}
				}
			}
		}];
	}

	function getTranslations() {
		return {
			es: 'js/login/i18n/es_LA.json',
			en: 'js/login/i18n/en_US.json'
		}
	}

})();
