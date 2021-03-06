﻿(function () {

    var OrdersController = function ($scope, $filter, $window, dataService) {
        $scope.customers = [];
        $scope.filteredCustomers;
        $scope.filteredCount;

        //paging
        $scope.totalRecords = 0;
        $scope.pageSize = 10;
        $scope.currentPage = 1;

        init();

        $scope.pageChanged = function (page) {
            $scope.currentPage = page;
            getCustomers();
        };

        function init() {
            createWatches();
            getCustomers();
        }

        function createWatches() {
            //Watch searchText value and pass it and the customers to nameCityStateFilter
            //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
            //while also accessing the filtered count via $scope.filteredCount above
            $scope.$watch("searchText", function (filterText) {
                filterCustomersProducts(filterText);
            });
        }

        function filterCustomersProducts(filterText) {
            $scope.filteredCustomers = $filter("nameProductFilter")($scope.customers, filterText);
            $scope.filteredCount = $scope.filteredCustomers.length;
        }

        function getCustomers() {
            dataService.getCustomers($scope.currentPage - 1, $scope.pageSize)
                .then(function (data) {
                    $scope.totalRecords = data.totalRecords;
                    $scope.customers = data.results;
                    filterCustomersProducts('');
                }, function (error) {
                    $window.alert(error.message);
                });
        }
    };

    OrdersController.$inject = ['$scope', '$filter', '$window', 'dataService'];

    angular.module('customersApp').controller('OrdersController', OrdersController);

}());