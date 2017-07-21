(function() {
	'use strict';

	var modulo = angular.module('sessionTimerModule', []);
	modulo.service('sessionTimerService', function(){
		var sessionLimitTime;
		var initialTime;
		var sessionTimer;

		var _self = this;

		this.setTimeOut = function(time){
			sessionLimitTime = time;
		};

		this.stopSessionTimer = function(){
			clearInterval(sessionTimer);
		};

		this.startSessionTimer = function(callback){
			initialTime = Date.now();
			_self.stopSessionTimer();

			sessionTimer = setInterval(function(){
				if (((Date.now() - initialTime) / 1000) >= sessionLimitTime){
					_self.stopSessionTimer();
					callback();
				}
			}, 1000);
		};

	});


})();
