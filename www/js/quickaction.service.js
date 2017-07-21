(function() {
	angular.module('QuickActionServiceModule',[]).factory('QuickActionService', ['$rootScope', '$q', QuickActionService]);

	QuickActionService.$inject = [
		'$rootScope',
		'$q'
	];


	function QuickActionService($rootScope, $q) {


		function check3DTouchAvailability() {
			return $q(function(resolve, reject) {
				if (window.ThreeDeeTouch) {
			      	window.ThreeDeeTouch.isAvailable(function (available) {
						resolve(available);
					});
				} else {
					reject();
				}
			});
		};


		function configure() {
			// Check if 3D Touch is supported on the device
			check3DTouchAvailability().then(function(available) {
				if (true) { // Comment out this check if testing in simulator
					window.ThreeDeeTouch.configureQuickActions([ // Configure Quick Actions
						{
							type: 'newContactenos',
							title: 'Contáctanos',
							subtitle: '',
							iconType: 'Mail'
						},{
							type: 'newTutorial',
							title: 'Tutorial',
							subtitle: '',
							iconType: 'Bookmark'
						},{
							type: 'NewFrecuentes',
							title: 'Preguntas Frecuentes',
							subtitle: '',
							iconType: 'Message'
						}
					]);

					// Set event handler to check which Quick Action was pressed
					window.ThreeDeeTouch.onHomeIconPressed = function(payload) {
						if (payload.type == 'NewFrecuentes') {
							$rootScope.$broadcast('newFrecuentesQuickAction');
						}

						if (payload.type == 'newTutorial') {
							$rootScope.$broadcast('newTutorialQuickAction');
						}

						if (payload.type == 'newContactenos') {
							$rootScope.$broadcast('newContactenosQuickAction');
						}
					};
				}
			})
		};


		return {
			configure: configure
		};


	}
})();
