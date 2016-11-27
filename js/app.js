(function() {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
        .directive('foundItems', FoundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {

        var ctrl = this;

        ctrl.searchMenuItems = function() {
            if (ctrl.searchTerm) {
                var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
                promise.then(function(response) {
                        ctrl.found = MenuSearchService.getItems();
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            } else {
                ctrl.found = [];
            }
        };

        ctrl.removeItem = function(itemIndex) {
            MenuSearchService.removeItem(itemIndex);
        };
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];

    function MenuSearchService($http, ApiBasePath) {

        var service = this;
        var foundItems = [];

        service.getMatchedMenuItems = function(searchTerm) {
            return $http({
                    method: "GET",
                    url: (ApiBasePath + "/menu_items.json")
                })
                .then(function(result) {
                    foundItems = [];
                    for (var i = 0; i < result.data.menu_items.length; i++) {
                        if (result.data.menu_items[i].description.indexOf(searchTerm) > -1) {
                            foundItems.push(result.data.menu_items[i]);
                        }
                    }
                });
        };

        service.getItems = function() {
            return foundItems;
        };

        service.removeItem = function(index) {
            foundItems.splice(index, 1);
        };

    }

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                foundMenuItems: '<',
                onRemove: '&'
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'foundItemsCtrl',
            bindToController: true,
            link: FoundItemsDirectiveLink
        };

        return ddo;
    }

    function FoundItemsDirectiveLink(scope, element, attrs, controller) {

        scope.$watch('foundItemsCtrl.itemsLength()', function(length) {
            if (length === undefined) {
							hideAll();
            } else if (length === 0) {
							showWarning();
            } else {
							showTable();
            }
        });

				function showWarning(){
					var divElement = element.find('div.text-danger');
					var tableElement = element.find('table.table');

					divElement.show();
					tableElement.hide();
				}

				function showTable(){
					var divElement = element.find('div.text-danger');
					var tableElement = element.find('table.table');

					divElement.hide();
					tableElement.show();
				}

				function hideAll(){
					var divElement = element.find('div.text-danger');
					var tableElement = element.find('table.table');

					divElement.hide();
					tableElement.hide();
				}

    }

    function FoundItemsDirectiveController() {

        var foundItemsCtrl = this;
        foundItemsCtrl.itemsLength = function() {
						if (foundItemsCtrl.foundMenuItems === undefined){
							return undefined;
						} else {
							return foundItemsCtrl.foundMenuItems.length;
						}
        };
    }


})();
