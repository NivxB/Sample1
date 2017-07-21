(function () {
	'use strict';

	var strMgr = angular
		.module('securityManager', [])
		.factory('keysStorage', keysStorageDef);

	keysStorageDef.$inject = [
        '$q',
		'$window',
		'memento'
    ];

	function keysStorageDef($q, $window,memento) {

		var securedStorage = undefined;
		var securedBoxName = 'catBox';
		var initialSalt = '68058f03fb4d65d81b5cdecf3e55ec27';

		var fct = {
			initStorage: function (callback) {
				securedStorage = new cordova.plugins.SecureStorage(
					function () {
						callback();
					},
					function (error) {
						callback(error);
					},
					securedBoxName);
			},
			getKeyValue: function (key, callback) {
				securedStorage.get(
					function (value) {
						callback(value);
					},
					function (error) {
						callback(error);
					},
					key);
			},
			setKey: function (key, value, callback) {
				securedStorage.set(
					function (key) {
						callback(key);
					},
					function (error) {
						callback(error);
					},
					key, value);
			},
			safeKeyGetter: function (key, callback) {
				if (securedStorage) {
					fct.getKeyValue(key, callback);
				} else {
					fct.initStorage(function () {
						fct.getKeyValue(key, callback);
					});
				}
			},
			safeKeySetter: function (key, value, callback) {
				if (securedStorage) {
					fct.setKey(key, value, callback);
				} else {
					fct.initStorage(function () {
						fct.setKey(key, value, callback);
					});
				}
			},
			generateRandomToken: function () {
				var salt = CryptoJS.lib.WordArray.random(128 / 8);
				var stringifiedSalt = salt.toString();
				return stringifiedSalt;
			},
			obtainCryptoHashers:function(){
				var preHashers = memento.returnSecuredHashes();
				var hasher1 = CryptoJS.AES.decrypt(preHashers.sh1, initialSalt);
				var hasher2 = CryptoJS.AES.decrypt(preHashers.sh2, initialSalt);
				var hashed = {
					shq1:hasher1.toString(CryptoJS.enc.Utf8),
					shq2:hasher2.toString(CryptoJS.enc.Utf8)
				}
				return hashed;
			},
			extractPersonalKey: function (key, callback) {
				fct.safeKeyGetter(key, function (value) {
					if (typeof value == 'string') {
						callback(value);
					} else {
						var salt = fct.generateRandomToken();
						fct.safeKeySetter(key, salt, function (key) {
							callback(salt);
						})
					}
				});
			}
		};

		return fct;
	}
})();
