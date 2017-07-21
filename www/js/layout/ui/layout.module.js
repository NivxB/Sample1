(function() {
	'use strict';

	var testVar = angular.module('layoutModule', [])

	testVar
		.config(appConfig)
		.run(appRun);

	appConfig.$inject = [
		'$locationProvider',
		'$controllerProvider',
		'$compileProvider',
		'$filterProvider',
		'$provide'
	];

	// saving references of providers to allow lazy loading and declaration of modules
	function appConfig($locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
		testVar.controller = $controllerProvider.register;
		testVar.directive = $compileProvider.directive;
		testVar.filter = $filterProvider.register;
		testVar.factory = $provide.factory;
		testVar.service = $provide.service;
	};

	function appRun() {
		console.log("app run");
	};

})();
