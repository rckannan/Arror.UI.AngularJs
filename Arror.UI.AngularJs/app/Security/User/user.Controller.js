/// <reference path="../../TestModule/seed-page.tmpl.html" />
(function () {
    'use strict';

    angular
        .module('security')
        .controller('userController', userController);

    /* @ngInject */
    function userController($mdDialog,$mdToast,$filter, arrHttpMenuService) {
        var vm = this;
        vm.user = {
            fldUser_ID: -1,
            fldUserName: '',
            fldPassword: '',
            fldFullUserName: '',

            fldActiveUser: true,
            fldForceChangePassword: false,
            fldEmailAddress: '',
            fldPasswordLastUpdated : new Date().toLocaleString('en-US'),
            fldGroupName: '',
            fldDomainName: '' 
        };

        vm.Menus = {};

        vm.cancelClick = cancelClick;
        vm.okClick = saveFeedback;
        vm.gridBtnClick = GridBtnClick;

       
        vm.mainGridOptions = {
            dataSource: {
                transport: {
                    read: function(e) {
                        arrHttpMenuService.getMenus('/api/User').then(function (response) {
                            e.success(response.data);
                        });
                    }
                },
                pageSize: 10,
                serverPaging: true,
                serverSorting: true
            },
            sortable: true,
            pageable: true,
            filterable: true,
            dataBound: function () {
                this.expandRow(this.tbody.find("tr.k-master-row").first());
            },
            columns: [{
                name: "upload",
                text: "Upload",
                template: '<a ng-click="vm.gridBtnClick()" class="k-button k-button-icontext k-grid-upload">Upload</a>',
                width: "50px"
            },{
                field: "fldUserName",
                title: "UserName"
            }, {
                field: "fldFullUserName",
                title: "FullUserName" 
            }, {
                field: "fldEmailAddress",
                title: "EmailAddress" 
            }, {
                field: "fldLastUpdated",
                title: "LastUpdated" 
            } ]
        };

        //vm.detailGridOptions = function (dataItem) {
        //    return {
        //        dataSource: {
        //            type: "odata",
        //            transport: {
        //                read: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
        //            },
        //            serverPaging: true,
        //            serverSorting: true,
        //            serverFiltering: true,
        //            pageSize: 5,
        //            filter: { field: "EmployeeID", operator: "eq", value: dataItem.EmployeeID }
        //        },
        //        scrollable: false,
        //        sortable: true,
        //        pageable: true,
        //        columns: [
        //        { field: "OrderID", title: "ID", width: "56px" },
        //        { field: "ShipCountry", title: "Ship Country", width: "110px" },
        //        { field: "ShipAddress", title: "Ship Address" },
        //        { field: "ShipName", title: "Ship Name", width: "190px" }
        //        ]
        //    };
        //};

       
        ////////////////

        function GridBtnClick() {
            $mdDialog.show({
                controller: 'userController',
                controllerAs: 'vm',
                templateUrl: 'app/Security/User/userDial.tmpl.html'
            })
             .then(function () {
                  
                 $mdToast.show(
                     $mdToast.simple()
                     .content($filter('translate')('Feedback has been sent to administrator.'))
                     .position('bottom right')
                     .hideDelay(2000)
                 );
             });
        }

        function cancelClick() {
            $mdDialog.cancel();
        }

        function saveFeedback() {
            //save here
            //arrHttpMenuService.postData('api/Feedback', vm.user);
            try {
                arrHttpMenuService.postData('/api/user', vm.user).then(function (response) {

                        var resp = response;
                    },
             function (err, status) {
                 $exceptionHandler('Error Message getMenus: ' + response.status + ' (' + response.statusText + ')' + err.error_description);
                 vm.message = "Error Message getMenus : " + err.error + err.error_description + " -- " + status;
             });
            } catch (applyError) {
                $exceptionHandler(applyError);
            }
        }
    }
})();