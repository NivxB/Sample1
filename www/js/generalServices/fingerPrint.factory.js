(function () {
	'use strict';

	var strMgr = angular
		.module('fingerPrintModule', [])
		.factory('fingerPrintAuth', fingerPrintAuthDef);

	fingerPrintAuthDef.$inject = [
		'$window'
	];

	function fingerPrintAuthDef($window) {

		var typeOfDevice;
		var serviceAvailabilty = false;
		if (ionic.Platform.isAndroid()) {
			typeOfDevice = 1;
		} else {
			if (ionic.Platform.isIOS() || ionic.Platform.isIPad()) {
				typeOfDevice = 2;
			} else {
				typeOfDevice = 3;
			}
		}

		//Android Authentication code
		function AndroidAuthenticate(callback) {
			function isAvailableSuccess(result) {
				if (result.isAvailable) {
					FingerprintAuth.show({
						clientId: "mWallet",
						clientSecret: "mWallet_encrypt"
					}, function (result) {
						callback(false, result);
					}, function (error) {
						callback(true, error);
					});
				}
			}

			function isAvailableError(message) {
				console.log("isAvailableError(): " + message);
			}

			FingerprintAuth.isAvailable(isAvailableSuccess, isAvailableError);
		}


		function iosAuthenticate(message, callback) {
			$window.plugins.touchid.isAvailable(
				function () {
					$window.plugins.touchid.verifyFingerprint(message, function (msg) {
						callback(false, msg);
					}, function (msg) {
						callback(true, msg);
					});
				},
				function (msg) {
					console.log('unavailable touchID: ', msg)
				}
			);
		}


		function androidCheckAvailability() {
			if (typeof FingerprintAuth !== 'undefined') {
				FingerprintAuth.isAvailable(function (result) {
					if (result.isAvailable && result.hasEnrolledFingerprints) {
						serviceAvailabilty = true;
					}
				}, function (eror) {
					serviceAvailabilty = false;
				});
			}
		}


		function iosCheckAvailability() {
			if ($window.plugins && $window.plugins.touchid) {
				$window.plugins.touchid.isAvailable(
					function (msg) {
						console.log(JSON.stringify(msg));
						serviceAvailabilty = true;
					},
					function (msg) {
						serviceAvailabilty = false;
					}
				);
			}
		}


		var fct = {
			authenticate: function (message, callback) {
				switch (typeOfDevice) {
				case 1:
					//Android device
					AndroidAuthenticate(callback);
					break;
				case 2:
					//iOS device
					iosAuthenticate(message, callback);
					break;
				default:
					callback(true, undefined);
				}
			},

			checkAvailability: function () {
				switch (typeOfDevice) {
				case 1:
					//Android device
					androidCheckAvailability();
					break;
				case 2:
					//iOS device
					iosCheckAvailability();
					break;
				default:
					serviceAvailabilty = false;
				}
			},

			isAvailable: function () {
				return serviceAvailabilty;
			},

			prepare: function () {
				this.checkAvailability();
			}
		};


		return fct;
	}
})();
