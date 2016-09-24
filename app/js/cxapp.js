'use strict';
define(['angularAMD'], function(angularAMD) {
	var cxapp = angular.module('chatApp',[]);

	cxapp.constant("BaseUrl", "http://localhost:3009");

	cxapp.controller('chatCtrl',['$scope', function($scope){
		console.log('load');
		$scope.minimize = false;

		$scope.submitChat = function(){
			console.log($scope.chat_content);
		}
	}]);

	return angularAMD.bootstrap(cxapp);
});
