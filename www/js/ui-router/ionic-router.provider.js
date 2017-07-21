(function () {
	'use strict';

	angular.module('routing', [])
		.provider('routingSetter', routingSetterProvider);

	routingSetterProvider.$inject = [
		'$locationProvider',
		'$stateProvider',
		'$urlRouterProvider'
	];

	function routingSetterProvider($locationProvider, $stateProvider, $urlRouterProvider) {
		var hasOtherwise = false;
		var transitedStates = [];

		var config = {
			docTitle: undefined,
			resolveAlways: {}
		};

		this.$get = routingSetter;
		routingSetter.$inject = [
			'$location',
			'$rootScope',
			'$state',
			'logonService'
		];

		function routingSetter($location, $rootScope, $state, logonService) {
			var handlingStateChangeError = false;
			var hasOtherwise = false;
			var goBackActive = false;

			var service = {
				setStates: setStates,
				getStates: getStates,
				clearBackStack:clearBackStack
			};

			routerInit();

			return service;

			function setStates(states, otherwisePath) {
				states.forEach(function (state) {
					var dependencies = [];

					if (state.config.dependencies && state.config.dependencies.length) {
						dependencies = dependencies.concat(state.config.dependencies);
					}

					if (state.config.views) {
						for (var view in state.config.views) {
							if (state.config.views[view].dependencies && state.config.views[view].dependencies.length) {
								dependencies = dependencies.concat(state.config.views[view].dependencies);
							}
						}
					}

					state.config.resolve = angular.extend(state.config.resolve || {}, dependencyResolverFor(dependencies));
					state.config.resolve = angular.extend(state.config.resolve || {}, config.resolveAlways);

					if (state.config.views && state.state.indexOf('.') === -1 && !state.config.noLayout) {
						state.config.views[''] = {
							templateUrl: './js/layout/ui/layout.view.html'
						};
					}

					$stateProvider.state(state.state, state.config);
				});

				if (otherwisePath && !hasOtherwise) {
					hasOtherwise = true;
					$urlRouterProvider.otherwise(otherwisePath);
				}
			}

			function changeStateSucess() {
				$rootScope.$on('$stateChangeSuccess',
					function (event, toState, toParams, fromState, fromParams) {
					    if(!fromState.abstract && !goBackActive){
							transitedStates.push(fromState);
						}
						goBackActive = false;
					});
				$state.goBack = function () {
					goBackActive = true;
					if (logonService.isActive()) {
						if (transitedStates.length) {
							var name = transitedStates.pop().name;
							if(name != 'login'){
								$state.go(name);
							}
						}
					} else {
						$state.go('login');
					}

				}
			}

			function routerInit() {
				changeStateSucess();
			}

			function getStates() {
				return $state.get();
			}

			function clearBackStack(){
				transitedStates = [];
			}

			function dependencyResolverFor(dependencies) {
				var definition = {
					resolver: ['$q', '$rootScope', function ($q, $rootScope) {
						var deferred = $q.defer();
						require(dependencies, function () {
							$rootScope.$apply(function () {
								deferred.resolve();
							});
						});
						return deferred.promise;
					}]
				};
				return definition;
			};
		}

	}
})();
