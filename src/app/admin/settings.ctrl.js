(function() {
    'use strict';

    angular
        .module('flavido')
        .controller('AdminSettingsController', AdminSettingsController);

    /** @ngInject */
    function AdminSettingsController(CommonInfo, $http, growl, $log, _, $scope, $state, $mdDialog) {
        var vm = this;

        vm.isCollapsed = true;
        vm.settingTab = 1;
        vm.parentId = null;

        vm.addCategories = addCategories;
        vm.updateCategories = updateCategories;

        activate();

        function activate() {
            vm.userInfo = CommonInfo.getInfo('userInfo');
            getHomeCategories();
        }

        function getHomeCategories() {
            $http.post(CommonInfo.getAppUrl() + "/gethomepagecategories", {}).then(
                function(response) {
                    if (response && response.data) {
                        if (response.data.status == 1) {
                            vm.homeCategories = response.data.data;
                        } else if (response.data.status == 2) {
                            growl.info(response.data.message);
                        }
                    } else {
                        growl.warning('There is some issue, please try after some time');
                    }
                },
                function(response) {
                    growl.warning('There is some issue, please try after some time');
                }
            );
        }

        function updateCategories() {
            $http.post(CommonInfo.getAppUrl() + "/updatehomepagecategory", {categories: vm.homeCategories}).then(
                function(response) {
                    if (response && response.data) {
                        if (response.data.status == 1) {
                            getHomeCategories();
                            growl.success('Categories updated successfuly');
                            $state.go('admin.settings.homePage');
                        } else if (response.data.status == 2) {
                            growl.info(response.data.message);
                        }
                    } else {
                        growl.warning('There is some issue, please try after some time');
                    }
                },
                function(response) {
                    growl.warning('There is some issue, please try after some time');
                }
            );
        }

        function addCategories() {
            var parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                targetEvent: event,
                scope: $scope.$new(),
                fullscreen: true,
                template: '<md-dialog aria-label="List dialog">' +
                    '<md-toolbar>' +
                    '<div class="md-toolbar-tools">' +
                    '<h2>Add Category</h2>' +
                    '<span flex></span>' +
                    '<md-button class="md-icon-button" ng-click="closeDialog()">' +
                    '<i class="fa fa-times" aria-hidden="true"></i>' +
                    '</md-button>' +
                    '</div>' +
                    '</md-toolbar>' +
                    '<md-dialog-content>' +
                    '<div class="md-dialog-content">' +
                    '<md-content md-theme="docs-dark" layout-gt-sm="row" layout-padding>' +
                    '<div>' +
                    '<md-input-container>' +
                    '<label>Name</label>' +
                    '<input ng-model="category.name">' +
                    '</md-input-container>' +
                    '<md-input-container>' +
                    '<label>Position</label>' +
                    '<input ng-model="category.position" type="number">' +
                    '</md-input-container>' +
                    '</div>' +
                    '</md-content>' +
                    '</div>' +
                    '</md-dialog-content>' +
                    '<md-dialog-actions>' +
                    '<md-button ng-click="addCategory()" class="md-primary">' +
                    'Add' +
                    '</md-button>' +
                    '<md-button ng-click="closeDialog()" class="md-primary">' +
                    'Close' +
                    '</md-button>' +
                    '</md-dialog-actions>' +
                    '</md-dialog>',
                controller: DialogController
            });

            function DialogController($scope, $mdDialog) {
                $scope.closeDialog = function() {
                    $mdDialog.hide();
                }

                $scope.addCategory = function() {
                    $http.post(CommonInfo.getAppUrl() + "/addhomepagecategory", $scope.category).then(
                        function(response) {
                            if (response && response.data) {
                                if (response.data.status == 1) {
                                    growl.success('Category added successfuly');
                                    getHomeCategories();
                                    $mdDialog.hide();
                                } else if (response.data.status == 2) {
                                    growl.info(response.data.message);
                                }
                            } else {
                                growl.warning('There is some issue, please try after some time');
                            }
                        },
                        function(response) {
                            growl.warning('There is some issue, please try after some time');
                        }
                    );
                }
            }
        }
    }
})();
