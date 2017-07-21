(function () {
	'use strict';
	var modl = angular
		.module('logon', [])
		.factory('logonService', LogonService);

	LogonService.$inject = [
		'$http',
		'$location',
	];

	function LogonService($http, $location) {
		var serv = this;
		serv.language = undefined;
		serv.active = false;
		serv.Role = undefined;
		serv.credentials = {};

		var isActive = function () {
			return serv.active;
		};

		var setActive = function (flag) {
			serv.active = flag;
		};

		var getLanguage = function () {
			return serv.language;
		};

		var setLanguage = function (language) {
			serv.language = language;
		};


		var getCredentials = function () {
			return serv.credentials;
		};

		var setCredentials = function (credentials) {
			serv.credentials = credentials;
		};

		var getRoleInfo = function(){
			return serv.Role;
		}

		var loadConfiguration = function () {
			var configPath = 'json!' + 'js/../roleConfig.json';
			require([configPath], function (loadedConfig) {
				serv.Role = loadedConfig[loadedConfig.currentRole];
			});
		};

		return {
			isActive: isActive,
			setActive: setActive,
			getLanguage: getLanguage,
			setLanguage: setLanguage,
			getCredentials: getCredentials,
			setCredentials: setCredentials,
			loadConfiguration:loadConfiguration,
			getRoleInfo:getRoleInfo
		};
	};
})();
