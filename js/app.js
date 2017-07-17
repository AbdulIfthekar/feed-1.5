var app = angular.module('feed', [])
    .filter('groupBy', function() {
        var results = {};
        return function(data, key) {
            if (!(data && key)) return;
            var result;
            if (!this.$id) {
                result = {};
            } else {
                var scopeId = this.$id;
                if (!results[scopeId]) {
                    results[scopeId] = {};
                    this.$on("$destroy", function() {
                        delete results[scopeId];
                    });
                }
                result = results[scopeId];
            }

            for (var groupKey in result)
                result[groupKey].splice(0, result[groupKey].length);

            for (var i = 0; i < data.length; i++) {
                if (!result[data[i][key]])
                    result[data[i][key]] = [];
                result[data[i][key]].push(data[i]);
            }

            var keys = Object.keys(result);
            for (var k = 0; k < keys.length; k++) {
                if (result[keys[k]].length === 0)
                    delete result[keys[k]];
            }
            return result;
        };
    })
    .constant('URL', 'https://dl.dropboxusercontent.com/s/nlpz9o8o5e1t602/Data.json?dl=0 ')
    .factory('DataService', function($http, URL) {
        var getData = function() {
            return $http.get(URL);
        };

        return {
            getData: getData
        };
    });


app.controller('dynamicMenuController', function($scope, DataService) {
    var ctrl = this;

    $scope.content = [];

    ctrl.fetchContent = function() {
        DataService.getData().then(function(result) {
            $scope.content = result.data;

        });
    };

    ctrl.fetchContent();

    $scope.category = 'category';
});

app.directive('dynamicMenu', function($compile) {
    return {
        restrict: 'EA',
        scope: {
            content: '='
        },
        template: '<div class="overContainer"><div class="title">{{content.title}}</div><div class="desc">{{content.description}}</div></div>'
    };
});