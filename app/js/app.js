;(function(){
  'use strict';

  var app = angular.module('myApp', ['ui.bootstrap']);

  app.service('APIService', ['$http', function($http) {
    return {
      getData: function(callback) {
        //$http.post('/mercolive-backend/web/app_dev.php/api/poolred/getLast.json')
        $http.get('api/testApi.json')
          .success(callback)
          .error(function(data, status, headers, config){
            console.log('Error: ', status, data);
        });
      }
    };
  }]);

  app.controller('MainCtrl', ['APIService', function(APIService) {
    var main = this;
    main.templates = [
      {
        name: "main",
        url:'partials/main.html'
      }
    ];

    main.template = main.templates[0];

    APIService.getData(function(result) {
      console.log('API call Results: ', result);
      main.title = result.data.title;
      main.description = result.data.description;
      main.cta = result.data.cta;
    });
    main.images = [{
      name: 'Grunt',
      src: 'img/grunt.svg'

    }, {
      name: 'Bower',
      src: 'img/bower.png'
    }, {
      name: 'Bootstrap',
      src: 'img/bootstrap.png'
    }, {
      name: 'AngularJS',
      src: 'img/angularjs.png'
    }];

  }]);

}());
