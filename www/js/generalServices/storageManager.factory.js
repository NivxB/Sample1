(function () {
	'use strict';

	var strMgr = angular
		.module('storageManager', [])
		.factory('memento', mementoDef);

	mementoDef.$inject = [
		'$q',
		'$window',
		'$timeout',
		'$cordovaDevice'
	];

	function mementoDef($q, $window, $timeout,$cordovaDevice) {

		var storageChecked = false;
		var db = undefined;
		var available = false;
		var device = undefined;
		var shaHashSecured1 = "U2FsdGVkX18ASERUgRrs8os5kUfaU1zS5n1R+EuPCOVMhZJcVZyxQUg3sEQxjPXsR87e9RcIXGQHbBM3UbJXYLlsyU7JKVgs/CFkc8vCu4s=";
		var shaHashSecured2 = "U2FsdGVkX196iGn8XtVRSuvKbgqtnJhksoAKlJokNBGiI16msEOkdP1/pfsd6/oi";

		var fct = {
			openLocalDatabase: function () {
				try {
					db = $window.sqlitePlugin.openDatabase({
						name: 'm.walletDb',
						location: 'default'
					});
					device = $cordovaDevice.getDevice();
					available = true;
				} catch (excpt) {
					console.warn('Running inside browser or emulator, therefore sqLite is unavailable.');
				}
			},
			initStorage: function (callback) {
				var query = "CREATE TABLE IF NOT EXISTS sessionInfo (id integer primary key, user integer, language text,others text)";
				db.transaction(function (tx) {
					tx.executeSql(query, null, function (tx, results) {
						storageChecked = true;
						callback(false, results);
					}, function (tx, error) {
						callback(true, error);
					});
				});
			},
			retrieveSessionData: function (callback) {
				db.transaction(function (tx) {
					var query = "select * from sessionInfo;";
					tx.executeSql(query, [], function (tx, results) {
						var row = {};
						if (results.rows.length) {
							row = results.rows.item(0);
						}
						if (row.others) {
							var bytes = CryptoJS.AES.decrypt(row.others, device.uuid);
							row.others = bytes.toString(CryptoJS.enc.Utf8);
							row.others = JSON.parse(row.others);
						}
						callback(false, row);
					}, function (tx, error) {
						callback(true, error);
					});
				});
			},
			automaticDataRetriever: function (callback) {
				if (storageChecked) {
					fct.retrieveSessionData(callback);
				} else {
					fct.initStorage(function (err, result) {
						if (!err) {
							fct.retrieveSessionData(callback);
						}
					});
				}
			},
			updateSessionData: function (obj, callback) {
				db.transaction(function (tx) {
					var query = "select count(*) as cnt from sessionInfo;";
					tx.executeSql(query, [], function (tx, results) {
						if (results.rows.item(0).cnt) {
							fct.updateDataRow(obj, callback);
						} else {
							fct.insertDataRow(obj, callback);
						}
					}, function (tx, error) {
						callback(true, error);
					});
				});
			},
			insertDataRow: function (obj, callback) {
				var query = "INSERT INTO sessionInfo (id,user,language,others) VALUES (?,?,?,?)";
				var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj.others), device.uuid);
				db.transaction(function (tx) {
					//tx.executeSql(query, [1, obj.user, obj.language, JSON.stringify(obj.others)],
					tx.executeSql(query, [1, obj.user, obj.language, ciphertext.toString()],
						function (tx, res) {
							callback(false, res);
						},
						function (tx, error) {
							callback(true, error);
						});
				});
			},
			updateDataRow: function (obj, callback) {
				var query = "UPDATE sessionInfo SET user = ? ,language = ? , others = ? WHERE id = ?";
				var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj.others), device.uuid);
				db.transaction(function (tx) {
					//tx.executeSql(query, [obj.user, obj.language, JSON.stringify(obj.others), 1],
					tx.executeSql(query, [obj.user, obj.language, ciphertext.toString(), 1],
						function (tx, res) {
							callback(false, res);
						},
						function (tx, error) {
							callback(true, error);
						});
				});
			},
			isAvailable: function () {
				return available;
			},
			returnSecuredHashes: function(){
				var shaHashers = {
					sh1:shaHashSecured1,
					sh2:shaHashSecured2
				}
				return shaHashers;
			}
		};

		return fct;
	}
})();
