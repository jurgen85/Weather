var app = angular.module("MyApp", []);

var url_weather = "https://api.forecast.io/forecast/21388d27f13fe23008d54b9922990a5b/53.2044043,6.5609889";

app.service("CalcService", function() {
    this.getCelcius = function(f) { 
		return (f- 32) * (5/9);
	};
	
	this.getWindSpeed = function(s) {
		return s * 1.609344;
	};
	
	this.getHumidity = function(h) {
		return h * 100;
	};
});

app.controller("PostsCtrl", function($scope, $http, CalcService) {
  var d = new Date();
  $scope.today = d.getDay() - 1;  
  $scope.daysOfTheWeek = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
  
  
  $http.jsonp(url_weather+"?callback=JSON_CALLBACK")
  	.success(function(data, status, headers, config) {
      $scope.currently = data.currently;
	  
	  $scope.temperature = CalcService.getCelcius(data.currently.temperature);
	  $scope.appTemperature = CalcService.getCelcius(data.currently.apparentTemperature);
	  $scope.windSpeed = CalcService.getWindSpeed(data.currently.windSpeed); 
	  $scope.humidity = CalcService.getHumidity(data.currently.humidity); 
	  console.log(data);
	  
	  $scope.daily = data.daily.data;
	  $scope.dayTemperatureMin = [];
	  $scope.dayTemperatureMax = [];
	  $scope.dayApparentTemperatureMin = [];
	  $scope.dayApparentTemperatureMax = [];
	  $scope.dayWindSpeed = [];
	  $scope.dayHumidity = [];
	  $scope.futureDay = [];
	  for (var i = 0; i < $scope.daily.length; i++) {
	    if (($scope.today + i + 1) > 6) {
			$scope.futureDay.push($scope.today + i - 6);
		} else {
			$scope.futureDay.push($scope.today + i + 1);
		}
		$scope.dayTemperatureMin.push(CalcService.getCelcius(data.daily.data[i].temperatureMin)); 
		$scope.dayTemperatureMax.push(CalcService.getCelcius(data.daily.data[i].temperatureMax)); 
		$scope.dayApparentTemperatureMin.push(CalcService.getCelcius(data.daily.data[i].apparentTemperatureMin)); 
		$scope.dayApparentTemperatureMax.push(CalcService.getCelcius(data.daily.data[i].apparentTemperatureMax)); 
		$scope.dayWindSpeed.push(CalcService.getWindSpeed(data.daily.data[i].windSpeed)); 
		$scope.dayHumidity.push(CalcService.getHumidity(data.daily.data[i].humidity)); 
	  }
    })
    .error(function(data, status, headers, config) {
      // log error
    });
});

app.directive('forecastPanels', function(){
	return{
		restrict: 'E',
		templateUrl: 'templates/forecast-panels.html',
		controller:function(){
			this.tab = 1;
			
			this.selectTab = function(setTab) {
				this.tab = setTab;
			};
			
			this.isSelected = function(checkTab){
				return this.tab === checkTab;
			};
		},
		controllerAs: 'panel'
	};									   
});