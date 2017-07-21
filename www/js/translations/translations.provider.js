(function () {
	'use strict';

	angular.module('translations', [])
		.provider('i18translate', i18nSetterProvider);

	i18nSetterProvider.$inject = [
		'$locationProvider',
		'$stateProvider',
		'$urlRouterProvider',
		'$translateProvider'
	];

	function i18nSetterProvider($locationProvider, $stateProvider, $urlRouterProvider, $translateProvider) {
		var languages = {};

		this.$get = i18translate;
		i18translate.$inject = [
			'$location',
			'$rootScope',
			'$translate'
		];

		function i18translate($location, $rootScope, $translate) {

			var service = {
				setLanguages: setLanguages,
				changeLanguage: changeLanguage,
				getUsingLanguage: getUsingLanguage,
				getLanguages: getLanguages
			};

			initTranslator();

			return service;

			function setLanguages(languagesList) {
				var languagesKeys = Object.keys(languagesList);
				languagesKeys.forEach(function (lang, idx) {
					var langPath = languagesList[lang];
					langPath = 'json!' + langPath;
					require([langPath], function (loadedLang) {
						languages[lang] = true;
						$translateProvider.translations(lang, loadedLang);
					});
				});
				//$translateProvider.useSanitizeValueStrategy('sanitize');
				$translateProvider.useSanitizeValueStrategy('escape');
				$translateProvider.preferredLanguage('es');
			}

			function changeLanguage(langKey) {
				$translate.use(langKey);
			}

			function getUsingLanguage() {
				return $translate.use();
			}

			function getLanguages() {
				return Object.keys(languages);
			}

			function onLanguageChange() {
				$rootScope.$on('$translateChangeSuccess', function (event, data) {
					document.documentElement.setAttribute('lang', data.language);
				});
			}

			function initTranslator() {
				onLanguageChange();
			}

		}

	}
})();
