/**
 * Author: Nizar BOUSEBSI
 * Description: AngularJS directive to process Speech Recognition in your Cordova & Web application.
 * Usage: Add this directive in your Directives folder.
 */

angular.module('app.directives', []).directive('ngSpeechRecognitionStart', function ($timeout, $rootScope) {
	return {
		restrict: 'A',
		link: function ($scope, $element, $attrs) {
			var recognition = new webkitSpeechRecognition();
			recognition.continuous = true;
			recognition.interimResults = false;

			//Change the recognition language here.
			recognition.lang = 'en-GB';

			var recognitionIsAlreadyCalled = false;

			$element.bind('touchstart mousedown', function (event) {
				$scope.isHolded = true;

				$timeout(function () {
					if ($scope.isHolded) {
						$scope.$apply(function () {

							if ($attrs.ngSpeechRecognitionStart) {
								$scope.$eval($attrs.ngSpeechRecognitionStart)
							}

							if (recognitionIsAlreadyCalled === false) {
								recognitionIsAlreadyCalled = true;
								recognition.start();
							}
						});
					}
				}, 600);
			});

			$element.bind('touchend mouseup', function (event) {
				$scope.isHolded = false;

				if ($attrs.ngSpeechRecognitionEnd) {
					$scope.$apply(function () {

						recognition.onresult = function (event) {

							if (event.results[0][0].transcript !== undefined) {
								$rootScope.transcript = event.results[0][0].transcript;
								$rootScope.textInput  = $rootScope.transcript;
								var obj = {
									result:{
										parameters:{
											echoText:$rootScope.textInput
										}
									}
								}
								$.ajax({
									url: "https://chatbot-ind.herokuapp.com/echo",
									data: obj,
									type: 'POST',
						            success: function(res) {
										console.log(res);
										if(res.displayText){
											$scope.transcriptResult = res.displayText;
										}						                
						            }
						        });
								if (typeof $rootScope.transcript === 'string') {
									$scope.$eval($attrs.ngSpeechRecognitionEnd);
								}
							}
						}
						recognition.stop();
						recognitionIsAlreadyCalled = false;
					});
				}
			});

			$scope.sendTextInput = function(){
				console.log($scope.textInput);
				var obj = {
					result:{
						parameters:{
							echoText:$scope.textInput
						}
					}
				}
				if($scope.textInput){
					$.ajax({
		            url: "https://chatbot-ind.herokuapp.com/echo",
					data: obj,
					type: 'POST',
		            success: function(res) {
						console.log(res);
						if(res.displayText){
							$scope.transcriptResult = res.displayText;
						}
		             }
			        });

				}else{
					// alert("Type something!");
				}

			}
		}
	};
})
