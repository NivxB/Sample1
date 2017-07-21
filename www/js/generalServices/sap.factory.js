(function () {
	'use strict';
	var modl = angular
		.module('sapServices', [])
		.factory('smartphoneServ', smartphoneService);

	smartphoneService.$inject = [
        '$http',
        '$location',
		'uuid4'
    ];

	function smartphoneService($http, $location, uuid4) {
		var ctrl = this;

		//Getting the window location
		var path = $location.path($location.path());
		//var baseUrl = path.$$protocol + "://" + "cserhc-thermopylae.c9.io" + ":8082";


		ctrl.post = function (obj, methodName, func, user, pass, requestCookie) {
			var urlToRequest = "";
			obj.traceNo =  uuid4.generate();

			if (requestCookie) {
				urlToRequest = baseUrl + "/" + methodName + "?create_mobiliser_remember_me=yes";
			} else {
				urlToRequest = baseUrl + "/" + methodName;
			}

			$http.defaults.headers.post['Content-Type'] = "application/json; charset=utf-8";
			$http.defaults.headers.common.Accept = "application/json";

			var request = {
				method: 'POST',
				url: urlToRequest,
				data: obj
			};

			$http(request).then(function (response) {
				var err = false;
				func(err, response);
			}, function (response) {
				var err = true;
				func(err, response);
			});
		}

		return {
			acceptTermAndConditions: function (obj, callback, user, pass, requestCookie) {
				ctrl.post(obj, "acceptTermAndConditions", callback, user, pass, requestCookie);
			}
		};
	};
})();
